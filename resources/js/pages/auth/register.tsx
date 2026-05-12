import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useLanguage } from '@/hooks/use-language';
import { login } from '@/routes';
import { store } from '@/routes/register';

export default function Register() {
    const { t } = useLanguage();

    const tName = t('auth_name');
    const tNamePlaceholder = t('auth_name_placeholder');
    const tEmail = t('auth_email');
    const tPassword = t('auth_password');
    const tPasswordPlaceholder = t('auth_password_placeholder');
    const tConfirmPassword = t('auth_confirm_password');
    const tConfirmPasswordPlaceholder = t('auth_confirm_password_placeholder');
    const tCreateAccount = t('auth_create_account');
    const tAlreadyAccount = t('auth_already_account');
    const tLogIn = t('auth_log_in');

    return (
        <>
            <Head title={t('auth_register_title')} />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">{tName}</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder={tNamePlaceholder}
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="username">
                                    {t('auth_username')}
                                </Label>
                                <Input
                                    id="username"
                                    type="text"
                                    required
                                    tabIndex={2}
                                    autoComplete="username"
                                    name="username"
                                    placeholder={t('auth_username_placeholder')}
                                />
                                <InputError message={errors.username} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">{tEmail}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={3}
                                    autoComplete="email"
                                    name="email"
                                    placeholder={t('auth_email_placeholder')}
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="no_telp">{t('phone')}</Label>
                                <Input
                                    id="no_telp"
                                    type="tel"
                                    required
                                    tabIndex={4}
                                    name="no_telp"
                                    placeholder={t('phone_placeholder')}
                                />
                                <InputError message={errors.no_telp} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">{tPassword}</Label>
                                <PasswordInput
                                    id="password"
                                    required
                                    tabIndex={5}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder={tPasswordPlaceholder}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    {tConfirmPassword}
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    tabIndex={6}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder={tConfirmPasswordPlaceholder}
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                tabIndex={7}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                {tCreateAccount}
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            {tAlreadyAccount}{' '}
                            <TextLink href={login()} tabIndex={8}>
                                {tLogIn}
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: 'auth_register_title',
    description: 'auth_register_description',
};
