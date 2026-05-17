import { Head } from '@inertiajs/react';
import React, { useEffect } from 'react';

interface Props {
    type: 'service' | 'sparepart';
    data: any;
}

export default function InvoicePage({ type, data }: Props) {
    useEffect(() => {
        // Automatically open print dialog when page loads
        window.print();
    }, []);

    const formatCurrency = (amount: number | string) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(Number(amount));
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    let items: any[] = [];
    let date = data.created_at || data.tanggal_service || new Date().toISOString();
    let total = 0;
    let noPolisi = '';

    if (type === 'service') {
        noPolisi = data.mobil?.no_polisi || '';
        date = data.tanggal_service;
        
        // Items in service
        items.push({
            name: `Jasa Service (${data.tipe_service})`,
            qty: 1,
            price: Number(data.harga_service) || (Number(data.total_service) - data.spareparts.reduce((acc: number, curr: any) => acc + (curr.pivot.jumlah * curr.pivot.harga_satuan), 0)),
        });

        data.spareparts?.forEach((sp: any) => {
            items.push({
                name: sp.nama_sparepart,
                qty: sp.pivot.jumlah,
                price: sp.pivot.harga_satuan,
            });
        });

        total = Number(data.total_service);
    } else if (type === 'sparepart') {
        date = data.created_at;

        data.spareparts?.forEach((sp: any) => {
            items.push({
                name: sp.nama_sparepart,
                qty: sp.pivot.jumlah,
                price: sp.pivot.harga_satuan,
            });
        });

        total = Number(data.total_harga);
    }

    const maxRows = 10;
    const populatedItems = items.map((item, index) => ({
        no: index + 1,
        name: item.name,
        qty: item.qty,
        price: formatCurrency(item.price),
        total: formatCurrency(item.qty * item.price)
    }));
    
    const emptyRowCount = Math.max(0, maxRows - populatedItems.length);
    const rows = [
        ...populatedItems,
        ...Array(emptyRowCount).fill(null).map(() => ({
            no: '',
            name: '',
            qty: '',
            price: '',
            total: '-'
        }))
    ];

    const invoiceNo = `${type === 'service' ? 'SRV' : 'INV'}-${String(data.id).padStart(4, '0')}`;

    return (
        <div>
            <Head title="DIVA AC – Invoice" />
            
            <style>{`
                /* ── Reset & Base ───────────────────────────────────────────── */
                body {
                  font-family: Arial, Helvetica, sans-serif !important;
                  background: #d0d0d0 !important;
                  display: flex !important;
                  justify-content: center !important;
                  align-items: flex-start !important;
                  padding: 30px 10px !important;
                  min-height: 100vh !important;
                  margin: 0 !important;
                  color: #000 !important;
                }

                /* ── A4 Page ────────────────────────────────────────────────── */
                .invoice-page-container {
                  width: 800px;
                  background: #ffffff;
                  padding: 24px 28px 20px;
                  box-shadow: 0 4px 24px rgba(0,0,0,.25);
                  box-sizing: border-box;
                }

                /* ── HEADER ─────────────────────────────────────────────────── */
                .header {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 10px;
                  border-bottom: 2px solid #000;
                  padding-bottom: 10px;
                  margin-bottom: 0;
                }

                /* LEFT */
                .header-left { display: flex; flex-direction: column; gap: 4px; align-items: flex-start; }

                .logo-combined {
                  height: 135px;
                  width: auto;
                  display: block;
                  margin: 0;
                }

                .biz-details {
                  font-size: 13px;
                  color: #111;
                  line-height: 1.55;
                  text-align: left;
                }

                .biz-details p { margin: 0; }
                .biz-bold { font-weight: 700; }

                /* RIGHT */
                .header-right {
                  display: flex;
                  flex-direction: column;
                  align-items: flex-end;
                  gap: 4px;
                }

                .invoice-title {
                  font-size: 40px;
                  font-weight: 900;
                  color: #a8c4e0;
                  letter-spacing: 3px;
                  text-transform: uppercase;
                  line-height: 1;
                }

                .hp-line {
                  font-size: 11.5px;
                  font-weight: 700;
                  color: #000;
                  text-align: right;
                }

                .info-fields {
                  width: 100%;
                  display: flex;
                  flex-direction: column;
                  border: 1.5px solid #8aabcf;
                  margin-top: 6px;
                  border-radius: 2px;
                  overflow: hidden;
                }

                .info-row {
                  display: grid;
                  grid-template-columns: 90px 1fr;
                  border-bottom: 1px solid #8aabcf;
                }

                .info-row:last-child { border-bottom: none; }

                .info-label {
                  background: #cddcee;
                  font-size: 11px;
                  font-weight: 700;
                  padding: 5px 8px;
                  white-space: nowrap;
                  border-right: 1px solid #8aabcf;
                  display: flex;
                  align-items: center;
                  text-align: left;
                }

                .info-value {
                  background: #fff;
                  font-size: 11px;
                  padding: 5px 8px;
                  min-width: 140px;
                  text-align: left;
                  color: #000;
                  font-weight: bold;
                }

                /* ── MAIN TABLE ─────────────────────────────────────────────── */
                .table-wrap { margin-top: 0; }

                .invoice-table {
                  width: 100%;
                  border-collapse: collapse;
                  font-size: 11.5px;
                }

                .invoice-table thead tr th {
                  background: #b4c6e7;
                  color: #000;
                  font-weight: 700;
                  font-size: 12px;
                  border: 1px solid #8aabcf;
                  padding: 6px 6px;
                  text-align: center;
                }

                .invoice-table thead tr th.col-desc { text-align: left; padding-left: 10px; }

                .invoice-table tbody tr td {
                  border: 1px solid #ccc;
                  padding: 4px 6px;
                  height: 22px;
                  text-align: center;
                  color: #000;
                }

                .invoice-table tbody tr td.col-desc { text-align: left; padding-left: 10px; }

                /* Alternating stripes */
                .invoice-table tbody tr:nth-child(odd)  td { background: #ffffff; }
                .invoice-table tbody tr:nth-child(even) td { background: #e8eef5; }

                /* ── TOTALS ROW ─────────────────────────────────────────────── */
                .totals-section {
                  display: grid;
                  grid-template-columns: 1fr auto;
                  gap: 0;
                  border-top: 1px solid #bbb;
                }

                .totals-right {
                  min-width: 260px;
                  display: flex;
                  flex-direction: column;
                }

                .total-row {
                  display: grid;
                  grid-template-columns: 1fr 90px;
                  border-bottom: 1px solid #bbb;
                }

                .total-row:last-child { border-bottom: none; }

                .total-label {
                  font-size: 11.5px;
                  font-weight: 700;
                  font-style: italic;
                  text-align: right;
                  padding: 5px 8px;
                  background: #dce9f7;
                  border-right: 1px solid #bbb;
                  border-left: 1px solid #bbb;
                  color: #000;
                }

                .total-value {
                  font-size: 11.5px;
                  text-align: center;
                  padding: 5px 6px;
                  background: #fff;
                  border-right: 1px solid #bbb;
                  color: #000;
                  font-weight: bold;
                }

                .total-row.discount .total-value {
                  background: #e8eef5;
                }

                /* ── FOOTER / NOTES + SIGNATURES ────────────────────────────── */
                .footer-section {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 10px;
                  margin-top: 6px;
                  padding-top: 6px;
                  border-top: 1px solid #ccc;
                }

                .notes-area { font-size: 10.5px; color: #222; text-align: left; }

                .notes-label {
                  font-weight: 700;
                  font-size: 10.5px;
                  margin-bottom: 2px;
                }

                .notes-text { font-size: 10px; color: #444; line-height: 1.6; }

                .signatures {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 10px;
                }

                .sig-block {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  font-size: 10.5px;
                  color: #222;
                }

                .sig-block .sig-label {
                  align-self: flex-start;
                  margin-bottom: 40px;
                }

                .sig-line {
                  width: 100%;
                  border-bottom: 1px solid #000;
                  margin-bottom: 4px;
                }

                .sig-name {
                  font-weight: 700;
                  font-size: 11px;
                  text-align: center;
                }

                /* ── PRINT ──────────────────────────────────────────────────── */
                @media print {
                  body {
                    background: none !important;
                    padding: 0 !important;
                  }
                  .invoice-page-container {
                    box-shadow: none !important;
                    width: 100% !important;
                    padding: 0 !important;
                  }
                  @page {
                    margin: 20px;
                  }
                }
            `}</style>

            <div className="invoice-page-container">

              {/* ════════════════════ HEADER ════════════════════ */}
              <div className="header">

                {/* LEFT */}
                <div className="header-left">
                  <img className="logo-combined" src="/logostruct.svg" alt="DIVA AC logo" />
                  <div className="biz-details">
                    <p className="biz-bold">Isi freon, Pasang Baru, Alarm, Central Lock</p>
                    <p className="biz-bold">Perempatan bedeng 20, Jl.Brigjen Katamso, Metro</p>
                    <p>Rek. BCA - 117 107 8321 / Mandiri - 1140 0077 24571 an.SUHENDRO</p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="header-right">
                  <div className="invoice-title">INVOICE</div>
                  <div className="hp-line">Hp : 0811 - 799 - 8851</div>
                  <div className="info-fields">
                    <div className="info-row">
                      <span className="info-label">INVOICE #</span>
                      <span className="info-value">{invoiceNo}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">No Pol :</span>
                      <span className="info-value">{noPolisi || '-'}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Tanggal :</span>
                      <span className="info-value">{formatDate(date)}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* ════════════════════ TABLE ════════════════════ */}
              <div className="table-wrap">
                <table className="invoice-table">
                  <thead>
                    <tr>
                      <th style={{ width: '42px' }}>NO.</th>
                      <th className="col-desc">Spare Part/Servis</th>
                      <th style={{ width: '80px' }}>Quantity</th>
                      <th style={{ width: '90px' }}>Unit Price</th>
                      <th style={{ width: '90px' }}>Line Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, idx) => (
                      <tr key={idx}>
                        <td>{row.no}</td>
                        <td className="col-desc">{row.name}</td>
                        <td>{row.qty}</td>
                        <td>{row.price}</td>
                        <td>{row.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ════════════════════ TOTALS ════════════════════ */}
              <div className="totals-section">
                <div>{/* spacer left */}</div>
                <div className="totals-right">
                  <div className="total-row">
                    <div className="total-label">SUBTOTAL</div>
                    <div className="total-value">{formatCurrency(total)}</div>
                  </div>
                  <div className="total-row discount">
                    <div className="total-label">DISCOUNT %</div>
                    <div className="total-value">-</div>
                  </div>
                  <div className="total-row">
                    <div className="total-label">TOTAL</div>
                    <div className="total-value">{formatCurrency(total)}</div>
                  </div>
                </div>
              </div>

              {/* ════════════════════ FOOTER ════════════════════ */}
              <div className="footer-section">

                {/* Notes */}
                <div className="notes-area">
                  <p className="notes-label">* Keterangan :</p>
                  <p className="notes-text">
                    garansi........bulan<br />
                    hanya untuk spare part<br />
                    yang di ganti *
                  </p>
                </div>

                {/* Signatures */}
                <div className="signatures">
                  <div className="sig-block">
                    <span className="sig-label">Penerima,</span>
                    <div className="sig-line"></div>
                    <span className="sig-name"></span>
                  </div>
                  <div className="sig-block">
                    <span className="sig-label">Hormat Kami,</span>
                    <div className="sig-line"></div>
                    <span className="sig-name">DIVA AC</span>
                  </div>
                </div>

              </div>

            </div>
        </div>
    );
}

InvoicePage.layout = (page: any) => page;
