// 1. Importações do Firebase v9 (usando CDN para rodar direto no navegador do MVP)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// SUBSTITUA PELAS CHAVES DO SEU PROJETO NO FIREBASE
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

// 2. Inicialização
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 3. Lógica da Interface
const btnGerarTreino = document.getElementById('btn-gerar-treino');

btnGerarTreino.addEventListener('click', async () => {
    const peso = document.getElementById('input-peso').value;
    const bf = document.getElementById('input-bf').value;
    const objetivo = document.getElementById('select-objetivo').value;

    if (!peso || !bf) {
        alert("Preencha seu Peso e BF para a IA calcular a intensidade!");
        return;
    }

    // Muda o texto do botão para dar feedback visual
    btnGerarTreino.innerText = "Calculando treino com IA...";
    btnGerarTreino.disabled = true;

    try {
        // Exemplo: Salvando as medidas de hoje no Firestore para histórico
        await addDoc(collection(db, "historico_medidas"), {
            peso: Number(peso),
            bf: Number(bf),
            objetivo: objetivo,
            data: serverTimestamp()
        });
        
        console.log("Medidas salvas no Firebase. Preparando prompt para a IA...");
        
        // TODO: No próximo passo, vamos injetar a chamada da API da Gemini/OpenAI aqui!

        alert("Base configurada! Pronto para conectar a IA.");

    } catch (error) {
        console.error("Erro ao salvar no Firebase:", error);
        alert("Erro na conexão com o banco de dados.");
    } finally {
        btnGerarTreino.innerText = "Gerar Treino do Dia";
        btnGerarTreino.disabled = false;
    }
});
