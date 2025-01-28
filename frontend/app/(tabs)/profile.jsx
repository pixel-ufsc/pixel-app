import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import profileImage from '../../assets/images/profile.png';
import { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Ícones do Material Design

export default function Profile() {
    let logado = true;
    if (logado) {
        return (ownProfile());
    } else {
        print('Ainda não existe validação de login ent n sei exatamente como seguir :(');
    }
}

const avatar = () => {
    return (
        <Image
            source={profileImage}
            style={[styles.photo, { borderRadius: 75 }, { marginBottom: 10 }]}
            resizeMode='contain'
        />
    );
}

function ModalEdit(props) {
    const [modal, setModal] = useState(false);
    const [apelido, setApelido] = useState(props.apelido);
    const [bio, setBio] = useState(props.bio);

    const toggleModal = () => {
        setModal(!modal);
    }

    const resetValues = () => {
        setApelido(props.apelido);
        setBio(props.bio);
        toggleModal();
    }

    const saveValues = (e) => {
        e.preventDefault();

        // Salvar valores
        const formData = new FormData(e.target);
        const textApelido = formData.get('apelido');
        const textBio = formData.get('bio');
        setApelido(textApelido);
        setBio(textBio);
        props.setApelido(textApelido);
        props.setBio(textBio);

        toggleModal();
    }

    return (
        <>
            <button style={styles.button} onClick={toggleModal}>
                {<MaterialCommunityIcons name="pencil" size={24} color="#f5f5f5" />}
            </button>

            {modal ? (
                <div >
                    <div style={styles.edit_overlay} onClick={toggleModal}></div>
                    <div style={styles.edit_content}>
                        {/* TODO: Adicionar edição de foto */}
                        <form method='post' onSubmit={saveValues}>
                            <div>
                                <label htmlFor="">Apelido:
                                    <input type="text" name='apelido' placeholder={apelido} />
                                </label>
                            </div>
                            <div>
                                <label htmlFor="">Bio nova:
                                    <input type="text" name='bio' placeholder={bio} />
                                </label>
                            </div>
                            <button style={styles.button} type='reset' onClick={resetValues}>
                                Cancelar
                                {<MaterialCommunityIcons name="pencil" size={24} color="#f5f5f5" />}
                            </button>
                            <button style={styles.button} type='submit'>
                                Salvar
                                {<MaterialCommunityIcons name="pencil" size={24} color="#f5f5f5" />}
                            </button>
                        </form>
                    </div>
                </div>
            ) : null}
        </>
    );
}

const ownProfile = () => {
    const localNome = 'nome';
    let [localApelido, setLocalApelido] = useState('apelido');
    let [localBio, setLocalBio] = useState('Bio muito dahora tipo você não tem noção');
    return (
        <View style={styles.profile}>
            {avatar()}
            <div>
            <Text style={styles.title}>{localApelido}</Text>
            <ModalEdit apelido={localApelido} bio={localBio} setApelido={setLocalApelido} setBio={setLocalBio} />
            </div>
            <Text style={styles.subtitle}>@{localNome}</Text>
            <Text>{localBio}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    photo: {
        width: 150,
        height: 150,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#f5f5f5',
    },
    subtitle: {
        fontSize: 16,
        color: '#cdcde0',
    },
    button: {
        // Isso está meio feio preciso melhorar isso mais tarde
        // Porém ainda não quebra a funcionalidade logo tudo certo o pixel app não explode amém 
        backgroundColor: 'transparent',
        border: 'none',
        fontSize: 18,
        cursor: 'pointer',
        color: '#f5f5f5',
    },
    profile: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        backgroundColor: '#984ad4',
        paddingVertical: 16,
        paddingHorizontal: '25%',
        wordBreak: 'break-word',
    },
    edit_overlay: {
        width: '100vw',
        height: '100vh',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        position: 'fixed',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    edit_content: {
        position: 'fixed',
        top: '35%',
        left: '45%',
        backgroundColor: '#984ad4',
        color: '#f5f5f5',
        fontSize: 16,
        padding: 16,
        borderRadius: 16
    }
});

/*
Pessoa 1
    Foto da pessoinha, que ela pode colocar qual quiser
    Nome e bios podem ser alteráveis
    APELIDO!!!

Pessoa 2
    Página dos projetos
    Criar componente de projetos que tem q ter nome, pessoas que estão no projeto e cargos delas
    Mesmo esquema pras diretorias

    DICA: Talvez dê pra fazer os dois do mesmo jeito através da mágica da componentização👀
*/