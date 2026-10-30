import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// 1. Chave da IA (COLE A SUA CHAVE REAL AQUI, MANTENDO AS ASPAS)
const GEMINI_API_KEY = "AQ.Ab8RN6Kf6sLYSKFAYrunsztDl8vWgfOixaHSA2YYrwbFEL19vQ"; 
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// 2. Elementos da Interface
const btnGerarTreino = document.getElementById('btn-gerar-treino');
const setupScreen = document.getElementById('setup-screen');
const treinoScreen = document.getElementById('treino-screen'); 
const listaExercicios = document.getElementById('lista-exercicios');

// 3. Lógica de Geração do Treino com IA
btnGerarTreino.addEventListener('click', async () => {
    const peso = document.getElementById('input-peso').value;
    const bf = document.getElementById('input-bf').value;
    const objetivo = document.getElementById('select-objetivo').value;

    if (!peso || !bf) {
        alert("Preencha o seu Peso e BF.");
        return;
    }

    btnGerarTreino.innerText = "IA Analisando e Montando Treino...";
    btnGerarTreino.disabled = true;

    try {
        console.log("A preparar o prompt para a IA...");
        
        // Prompt Inteligente
        const prompt = `Você é um personal trainer de elite focando na metodologia Heavy Duty.
        Crie um treino para um aluno com ${peso}kg, ${bf}% de BF, cujo objetivo é ${objetivo}.
        O foco do treino de hoje é: Peitoral e Tríceps.
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
        
        console.log("Resposta recebida da IA:", responseText);

        // Limpa possíveis formatações devolvidas pela IA
        const cleanJsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const treinoData = JSON.parse(cleanJsonString);

        renderizarTreino(treinoData.treino);

    } catch (error) {
        console.error("Erro na IA:", error);
        alert("Erro ao gerar treino. Verifique a consola.");
    } finally {
        btnGerarTreino.innerText = "Gerar Treino do Dia";
        btnGerarTreino.disabled = false;
    }
});

// 4. Função para desenhar o treino no ecrã
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
