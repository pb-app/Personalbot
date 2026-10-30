// 1. Importações
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// 2. Configurações (Preencha com suas chaves - NÃO SUBA A CHAVE DA IA NO GITHUB PÚBLICO)
const firebaseConfig = {
  apiKey: "AIzaSyBQITYFwBx48FXg1ZYIDnkCtjJSaG3eJ9Y",
  authDomain: "personalbot-f7db4.firebaseapp.com",
  projectId: "personalbot-f7db4",
  storageBucket: "personalbot-f7db4.firebasestorage.app",
  messagingSenderId: "653194890538",
  appId: "1:653194890538:web:363cccd4c69cec7a742253"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// INCLUA SUA CHAVE DO GOOGLE GEMINI AQUI PARA TESTE LOCAL
const GEMINI_API_KEY = "AQ.Ab8RN6L7tK3k81e59AZKhWfbi8wc_0CTeDfg0kJUwYM2ac8Xew"; 
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// 3. Elementos da UI
const btnGerarTreino = document.getElementById('btn-gerar-treino');
const setupScreen = document.getElementById('setup-screen');
// Precisamos adicionar esse conteiner no index.html (veja o código abaixo)
const treinoScreen = document.getElementById('treino-screen'); 
const listaExercicios = document.getElementById('lista-exercicios');

// 4. Lógica de Geração do Treino com IA
btnGerarTreino.addEventListener('click', async () => {
    const peso = document.getElementById('input-peso').value;
    const bf = document.getElementById('input-bf').value;
    const objetivo = document.getElementById('select-objetivo').value;
    const musculoFoco = "Peitoral e Tríceps"; // Pode virar um input depois

    if (!peso || !bf) {
        alert("Preencha seu Peso e BF.");
        return;
    }

    btnGerarTreino.innerText = "IA Analisando e Montando Treino...";
    btnGerarTreino.disabled = true;

    try {
        // Salva histórico no Firebase
        await addDoc(collection(db, "historico_medidas"), {
            peso: Number(peso), bf: Number(bf), objetivo, data: serverTimestamp()
        });

        // Prompt Inteligente (Aqui entra a simulação de metodologia)
        const prompt = `Você é um personal trainer de elite focando na metodologia Heavy Duty.
        Crie um treino para um aluno com ${peso}kg, ${bf}% de BF, cujo objetivo é ${objetivo}.
        O foco do treino de hoje é: ${musculoFoco}.
        Retorne APENAS um JSON válido neste formato exato (sem formatação markdown, sem crases):
        {
          "treino": [
             {"nome": "Nome do Exercício", "series": "Número de séries", "reps": "Repetições ou tempo", "instrucao": "Dica técnica baseada na metodologia escolhida"}
          ]
        }`;

        // Chamada à API do Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        // Limpa possíveis marcações de código markdown retornadas pela IA
        const cleanJsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const treinoData = JSON.parse(cleanJsonString);

        renderizarTreino(treinoData.treino);

    } catch (error) {
        console.error("Erro na IA ou Firebase:", error);
        alert("Erro ao gerar treino. Verifique o console.");
    } finally {
        btnGerarTreino.innerText = "Gerar Treino do Dia";
        btnGerarTreino.disabled = false;
    }
});

// 5. Função para desenhar o treino na tela
function renderizarTreino(exercicios) {
    setupScreen.classList.remove('active');
    treinoScreen.classList.add('active');
    
    listaExercicios.innerHTML = '';
    
    exercicios.forEach((ex, index) => {
        const div = document.createElement('div');
        div.className = 'exercicio-card';
        div.innerHTML = `
            <h3>${index + 1}. ${ex.nome}</h3>
            <p><strong>Séries:</strong> ${ex.series} | <strong>Reps:</strong> ${ex.reps}</p>
            <p class="instrucao">💡 ${ex.instrucao}</p>
            <div class="actions">
                <button class="btn-check">Feito ✅</button>
                <button class="btn-trocar">Trocar (Ocupado) 🔄</button>
            </div>
        `;
        listaExercicios.appendChild(div);
    });
}
