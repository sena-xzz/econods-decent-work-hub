export const MIN_PASSWORD_LENGTH = 6;

export function passwordValidationMessage(password) {
    return password.length < MIN_PASSWORD_LENGTH
        ? 'A senha precisa ter no mínimo 6 caracteres. Espaços também contam; a senha não será alterada.'
        : '';
}

export function authErrorMessage(error) {
    const code = error?.code || '';
    const message = error?.message || '';
    const reasons = error?.reasons || error?.weak_password?.reasons || [];
    if (reasons.includes('pwned') || /known to be weak|easy to guess/i.test(message)) {
        return 'Essa senha apareceu em vazamentos de dados e não pode ser usada. Ter 6 caracteres atende ao tamanho mínimo, mas não elimina essa verificação. Escolha outra senha, de preferência mais longa e exclusiva.';
    }
    if (code === 'weak_password') {
        return 'Essa senha não atende às regras de segurança. Use uma senha mais longa e exclusiva; o tamanho mínimo não garante que ela seja aceita.';
    }
    if (code === 'invalid_credentials' || /Invalid login/i.test(message)) return 'E-mail ou senha incorretos.';
    if (code === 'email_not_confirmed' || /not confirmed/i.test(message)) return 'Confirme seu e-mail antes de entrar.';
    if (code === 'user_already_exists' || /already registered/i.test(message)) return 'Este e-mail já está em uso. Entre com sua conta existente.';
    if (/at least|minimum.*characters/i.test(message)) return 'A senha não atende ao tamanho mínimo exigido pelo serviço. Confira as regras de senha da conta.';
    if (code === 'over_email_send_rate_limit') return 'O limite de envio de e-mails foi atingido. Aguarde antes de tentar novamente.';
    if (code === 'over_request_rate_limit' || error?.status === 429) return 'Muitas tentativas em pouco tempo. Aguarde e tente novamente.';
    if (code === 'email_address_invalid' || /invalid.*email|email.*invalid/i.test(message)) return 'Confira o endereço de e-mail e tente novamente.';
    if (code === 'signup_disabled') return 'O cadastro está temporariamente indisponível. Tente novamente mais tarde.';
    if (error?.name === 'AuthRetryableFetchError' || /fetch|network|connection/i.test(message)) return 'Não foi possível conectar ao serviço. Confira sua internet e tente novamente.';
    return 'Não foi possível concluir a solicitação. Tente novamente. Se o erro continuar, informe este código: ' + (code || 'erro de conexão');
}

export async function runAuthAttempt({ request, onResult, onError, setLoading }) {
    setLoading(true);
    try {
        const result = await request();
        if (result.error) onError(authErrorMessage(result.error));
        else onResult(result.data);
    } catch (error) {
        onError(authErrorMessage(error));
    } finally {
        setLoading(false);
    }
}