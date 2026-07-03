type FirebaseLikeError = {
  code?: string;
  message?: string;
};

const getErrorCode = (error: unknown) => {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    return String((error as FirebaseLikeError).code || '');
  }

  return '';
};

export const getAuthErrorMessage = (error: unknown, isRegister = false) => {
  const code = getErrorCode(error);
  const message = error instanceof Error ? error.message : '';

  if (message.includes('Firebase não está configurado')) {
    return message;
  }

  switch (code) {
    case 'auth/email-already-in-use':
      return 'Este e-mail já está cadastrado. Tente entrar em vez de criar conta.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'E-mail ou senha inválidos.';
    case 'auth/invalid-email':
      return 'Digite um e-mail válido.';
    case 'auth/weak-password':
      return 'Use uma senha com pelo menos 6 caracteres.';
    case 'auth/password-does-not-meet-requirements':
      return 'A senha não atende à política do Firebase. Tente uma senha maior, com letras e números.';
    case 'auth/email-not-verified':
      return 'Confirme seu e-mail antes de entrar. Enviamos um novo link de verificação.';
    case 'auth/operation-not-allowed':
    case 'auth/admin-restricted-operation':
      return 'Ative o provedor Email/Password no Firebase Authentication.';
    case 'auth/configuration-not-found':
      return 'A configuração do Firebase Auth não foi encontrada. Confira se este app web pertence ao mesmo projeto do Authentication.';
    case 'auth/app-not-authorized':
      return 'Este domínio não está autorizado no Firebase Authentication.';
    case 'auth/popup-closed-by-user':
      return 'Login com Google cancelado.';
    case 'auth/popup-blocked':
      return 'O navegador bloqueou a janela do Google. Libere pop-ups para este site.';
    case 'auth/network-request-failed':
      return 'Falha de rede ao falar com o Firebase. Verifique sua internet e tente novamente.';
    case 'permission-denied':
      return 'A conta foi autenticada, mas o Firestore bloqueou o perfil. Publique as regras do arquivo firestore.rules.';
    default:
      if (code.includes('api-key-not-valid') || code.includes('invalid-api-key')) {
        return 'A chave do Firebase está inválida ou bloqueada. Confira a API key no .env e as restrições dela no Google Cloud.';
      }

      return code
        ? 'Erro ao autenticar. Tente novamente.'
        : isRegister
          ? 'Erro ao criar conta. Tente novamente.'
          : 'Erro ao fazer login. Verifique suas credenciais.';
  }
};
