<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

#[Fillable(['name', 'email', 'password', 'username', 'role', 'no_telp', 'alamat', 'jenis_kelamin', 'tanggal_daftar'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    protected $appends = ['nama_pelanggan', 'nama_mekanik'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'tanggal_daftar' => 'date',
        ];
    }

    public function mekanik()
    {
        return $this->hasOne(Mekanik::class);
    }

    public function admin()
    {
        return $this->hasOne(Admin::class);
    }

    public function mobils()
    {
        return $this->hasMany(Mobil::class, 'id_pelanggan');
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isMekanik(): bool
    {
        return $this->role === 'mekanik';
    }

    public function isCustomer(): bool
    {
        return $this->role === 'customer';
    }

    public function getNamaPelangganAttribute()
    {
        return $this->name;
    }

    public function setNamaPelangganAttribute($value)
    {
        $this->attributes['name'] = $value;
    }

    public function getNamaMekanikAttribute()
    {
        return $this->name;
    }

    public function setNamaMekanikAttribute($value)
    {
        $this->attributes['name'] = $value;
    }
}
