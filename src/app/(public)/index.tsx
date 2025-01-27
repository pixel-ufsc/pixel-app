import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Snackbar, Button } from 'react-native-paper';

export default function SignInWithEmailOTP() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'EMAIL' | 'CODE'>('EMAIL');
  const [isLoading, setIsLoading] = useState(false);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const showError = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  // manda o codigo pro email, se for um email valido dentro do clerk
  async function handleRequestCode() {
    if (!isLoaded) return;

    setIsLoading(true);
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        strategy: 'email_code',
      });

      if (signInAttempt.status === 'needs_first_factor') {
        setStep('CODE');
      } else if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/(auth)');
      } else {
        showError('Erro inesperado. Tente novamente.');
      }
    } catch (error) {
      showError(
        'Erro ao enviar o código. Verifique o e-mail e tente novamente.'
      );
    } finally {
      setIsLoading(false);
    }
  }

  // valida aqui o codigo recebido
  async function handleVerifyCode() {
    if (!isLoaded) return;

    setIsLoading(true);
    try {
      const signInAttempt = await signIn.attemptFirstFactor({
        strategy: 'email_code',
        code,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/(auth)');
      } else {
        showError('Código inválido. Tente novamente.');
      }
    } catch (error) {
      showError('Erro ao verificar o código. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        {/* Logo */}
        <Image
          source={require('../../../assets/logo.png')}
          style={styles.logo}
        />

        {step === 'EMAIL' ? (
          <>
            <Text style={styles.label}>Digite seu e-mail:</Text>
            <TextInput
              style={styles.input}
              value={emailAddress}
              onChangeText={setEmailAddress}
              placeholder='seu_email@ejpixel.com.br'
              keyboardType='email-address'
              autoCapitalize='none'
            />
            <Button
              mode='contained'
              onPress={handleRequestCode}
              loading={isLoading}
              disabled={isLoading || !emailAddress}
              style={styles.button}
            >
              Enviar código
            </Button>
          </>
        ) : (
          <>
            <Text style={styles.label}>
              Informe o código que recebeu no e-mail:
            </Text>
            <TextInput
              style={styles.input}
              value={code}
              onChangeText={setCode}
              placeholder='Código de 6 dígitos'
              keyboardType='numeric'
            />
            <Button
              mode='contained'
              onPress={handleVerifyCode}
              loading={isLoading}
              disabled={isLoading || !code}
              style={styles.button}
            >
              Entrar
            </Button>
            {/* retornar caso a pessoa tenha botado um email nada a ver ou excedido o maximo de tries */}
            <Button
              mode='outlined'
              onPress={() => setStep('EMAIL')}
              style={styles.button}
            >
              Voltar para o e-mail
            </Button>
          </>
        )}

        {/* mostra alguns erros de login, tem q melhorar ainda */}
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          action={{
            label: 'Fechar',
            onPress: () => setSnackbarVisible(false),
          }}
        >
          {snackbarMessage}
        </Snackbar>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    padding: 32,
    justifyContent: 'center',
    gap: 12,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  logo: {
    width: '60%',
    height: '40%',
    alignSelf: 'center',
    marginBottom: 32,
  },
  button: {
    marginTop: 8,
  },
});
