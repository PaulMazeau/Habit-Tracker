import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, TextInput } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FB_DB } from '../firebaseconfig';
import { doc, setDoc } from 'firebase/firestore';

export default function SignUpScreen() {

    const navigation = useNavigation();
    const { signUp } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    // Gestion d'affichage des Erreurs
    const [errorFirstName, setErrorFirstName] = useState('');
    const [errorLastName, setErrorLastName] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [errorPassword, setErrorPassword] = useState('');


    const SignUpUser = () => {
        // Réinitialisation des messages d'erreur
        setErrorFirstName('');
        setErrorLastName('');
        setErrorEmail('');
        setErrorPassword('');
    
        let isValid = true; // Pour suivre la validité des entrées
    
        // Validation du prénom
        if (!firstName.trim()) {
            setErrorFirstName("Le prénom est requis.");
            isValid = false;
        }
        // Validation du nom de famille
        if (!lastName.trim()) {
            setErrorLastName("Le nom de famille est requis.");
            isValid = false;
        }
        // Validation de l'email
        if (!email.trim()) {
            setErrorEmail("L'email est requis.");
            isValid = false;
        }
        // Validation du mot de passe
        if (!password.trim()) {
            setErrorPassword("Le mot de passe est requis.");
            isValid = false;
        }
    
        // Si toutes les validations sont passées, on peut procéder à la création du compte
        if (isValid) {
            signUp(email, password)
            .then((userCredential) => {
                // Enregistrement des informations de l'utilisateur dans Firestore
                const userDocRef = doc(FB_DB, 'users', userCredential.user.uid);
                return setDoc(userDocRef, {
                    FirstName: firstName,
                    LastName: lastName,
                });
            })
            .then(() => {
                console.log('Informations de l’utilisateur enregistrées avec succès dans Firestore.');
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Main' }],
                });
            })
            .catch((error) => {
                // Gestion des erreurs séparément pour signUp et setDoc
                console.error('Erreur lors de la création de compte ou de l’enregistrement des informations :', error);
                if (error.code) {
                    // Gestion des différents codes d'erreur ici
                    if (error.code === 'auth/email-already-in-use') {
                        setErrorEmail("L'email est déjà utilisé.");
                    } else if (error.code === 'auth/invalid-email') {
                        setErrorEmail("L'email est invalide.");
                    } else if (error.code === 'auth/weak-password') {
                        setErrorPassword("Le mot de passe doit contenir au moins 6 caractères.");
                    } else {
                        // Pour toute autre erreur non gérée spécifiquement
                        console.error('Erreur non spécifiée :', error);
                    }
                }
            });
        }
    };
    


    return (
        <View style={styles.container}>
            <SafeAreaView>
                <TouchableOpacity
                    style={styles.BackBtn}
                    onPress={() => navigation.goBack()}
                >
                    <Text>Retour</Text>
                </TouchableOpacity>
            </SafeAreaView>
            <Text style={styles.text}>Créer un {'\n'}compte. </Text>
            <View style={styles.main}>
                <TextInput
                    style={styles.input}
                    placeholder="Prénom"
                    onChangeText={(text) => setFirstName(text)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholderTextColor="rgba(255, 255, 255, 0.7)"
                />
                {errorFirstName ? <Text style={styles.errorText}>{errorFirstName}</Text> : null}
                <TextInput
                    style={styles.input}
                    placeholder="Nom de famille"
                    onChangeText={(text) => setLastName(text)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholderTextColor="rgba(255, 255, 255, 0.7)"
                />
                {errorLastName ? <Text style={styles.errorText}>{errorLastName}</Text> : null}
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    onChangeText={(text) => setEmail(text)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholderTextColor="rgba(255, 255, 255, 0.7)"
                />
                {errorEmail ? <Text style={styles.errorText}>{errorEmail}</Text> : null}
                <TextInput
                    style={styles.input}
                    placeholder="Mot de passe"
                    onChangeText={(text) => setPassword(text)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={true}
                    placeholderTextColor="rgba(255, 255, 255, 0.7)"
                />
                {errorPassword ? <Text style={styles.errorText}>{errorPassword}</Text> : null}
            </View>
            <TouchableOpacity
                onPress={() => SignUpUser(email, password, firstName, lastName)}
                style={styles.button}
            >
                <Text>S'inscrire</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
                onPress={() => navigation.navigate('SignIn')}
                style={styles.button2}
            >
                <Text style={styles.txtBtn2}>Tu as déjà un compte? Connecte toi</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    // Je met mes styles ici comme ca tu peux voir aisément ce que je touche
    errorText: {
        fontSize: 13,
        color: 'red',
        marginLeft: '10%',
        marginBottom: 5,
    },
    container: {
        flex: 1,
        backgroundColor: 'black'
    },
    text: {
        fontWeight: 'bold',
        fontSize: 37,
        color: 'white',
        marginTop: '5%',
        marginLeft: '10%'
    },
    txtBtn2: {
        color: 'white'
    },
    main: {
        width: '100%',
        marginTop: '10%'
    },
    input: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        marginTop: 10,
        borderBottomColor: 'white',
        borderBottomWidth: 2,
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
        marginBottom: 15,
        width: '80%',
        marginLeft: '10%',
        marginRight: '10%'
    },
    rowseparator: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    separator: {
        width: '30%',
        height: 1,
        backgroundColor: 'white',
        marginTop: 25,
    },
    txtseparator: {
        marginTop: 15,
        width: '20%',
        color: 'white',
        justifyContent: 'center',
        textAlign: 'center',
    },
    button: {
        marginTop: 50,
        height: 47,
        width: '80%',
        backgroundColor: "white",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginLeft: '10%',
        marginRight: '10%'
    },
    buttonFacebook: {
        marginTop: 20,
        height: 47,
        width: '80%',
        backgroundColor: "#172ACE",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginLeft: '10%',
        marginRight: '10%',
    },
    buttonGoogle: {
        marginTop: 50,
        height: 47,
        width: '80%',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginLeft: '10%',
        marginRight: '10%'
    },
    button2: {
        marginTop: 20,
        marginLeft: '10%',
        marginRight: '10%',
        alignItems: 'center'
    },
    BackBtn: {
        marginLeft: '10%'
    }
})