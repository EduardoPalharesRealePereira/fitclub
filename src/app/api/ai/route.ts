import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Groq uses OpenAI-compatible API — free tier, fast LLaMA 3
const GROQ_API = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

function buildSystemPrompt(profile: Record<string, string>, mode: "chat" | "workout" | "diet") {
  const profileText = profile
    ? `Dados do cliente:
- Nome: ${profile.name || "não informado"}
- Idade: ${profile.age || "não informado"} anos
- Sexo: ${profile.sex === "M" ? "Masculino" : profile.sex === "F" ? "Feminino" : "não informado"}
- Peso: ${profile.weight || "não informado"} kg
- Altura: ${profile.height || "não informado"} cm
- Objetivo: ${profile.goal || "não informado"}
- Nível: ${profile.level || "não informado"}
- Restrições/Observações: ${profile.notes || "nenhuma"}`
    : "Perfil ainda não preenchido.";

  if (mode === "workout") {
    return `Você é um personal trainer especialista com 15 anos de experiência em musculação, crossfit e condicionamento físico. Crie uma ficha de treino semanal completa e inteligente com base nos dados do cliente abaixo.

${profileText}

REGRAS OBRIGATÓRIAS para montar a ficha:

1. VOLUME: Cada dia deve ter entre 7 e 8 exercícios no total, incluindo obrigatoriamente 1 exercício de cardio em algum ponto da sessão (pode ser no início como aquecimento, no meio como circuito, ou no final como finalizador). Cardio pode ser: corrida na esteira, escada, bike, pular corda, remo ergométrico, sprint, HIIT, ou esportes se o cliente mencionar preferência nas restrições/observações.

2. DISTRIBUIÇÃO MUSCULAR INTELIGENTE — a semana toda deve se comunicar:
   - Nunca deixar um músculo secundário "órfão": se num dia você treina peito + tríceps, em outro dia treina costas + bíceps. Se colocar ombro no dia de peito, coloque ombro também no dia de costas OU mova ombro para um dia dedicado ou junto de pernas/glúteos.
   - Músculos sinérgicos devem aparecer no mesmo dia (ex: peito+tríceps, costas+bíceps, quadríceps+glúteos).
   - Evitar treinar o mesmo músculo em dias consecutivos.
   - Adapte a divisão ao objetivo: emagrecimento = mais dias full body ou circuito; hipertrofia = divisão por grupos musculares; condicionamento = mais cardio e funcional; força = compostos pesados com menos isoladores.

3. TIPOS DE EXERCÍCIO: Priorize exercícios compostos (agachamento, supino, levantamento terra, barra, remada) para os primeiros slots, isoladores depois, cardio estrategicamente posicionado. Varie os equipamentos (barra, halteres, máquinas, peso corporal).

4. PARÂMETROS: Ajuste séries, repetições e descanso ao nível e objetivo do cliente. Iniciante: 3 séries, 12-15 reps, 60-90s. Intermediário: 4 séries, 8-12 reps, 60-90s. Avançado: 4-5 séries, 6-12 reps, 45-120s.

5. DICAS TÉCNICAS: Cada exercício deve ter uma tip curta e útil (execução, respiração, erro comum a evitar).

IMPORTANTE: Responda APENAS com um JSON válido, sem texto antes ou depois, sem markdown, sem comentários. Use exatamente este formato:
{
  "name": "Nome da ficha",
  "frequency": "X dias por semana",
  "goal": "objetivo resumido em 1 frase",
  "days": [
    {
      "day": "Segunda-feira",
      "focus": "Peito, Tríceps e Cardio",
      "exercises": [
        { "name": "Nome do exercício", "sets": 4, "reps": "8-12", "rest": "90s", "tip": "dica técnica curta", "type": "strength" },
        { "name": "Esteira (corrida moderada)", "sets": 1, "reps": "20min", "rest": "-", "tip": "mantenha frequência cardíaca entre 65-75% do máximo", "type": "cardio" }
      ]
    }
  ]
}

O campo "type" deve ser "strength", "cardio" ou "mobility".

REGRA ABSOLUTA DE POSICIONAMENTO: O exercício de cardio deve ser SEMPRE o último item do array "exercises" de cada dia, sem exceção. Nunca coloque cardio no meio ou início da lista.`;
  }

  if (mode === "diet") {
    return `Você é um nutricionista esportivo especialista. Com base nos dados do cliente abaixo, crie um plano alimentar diário detalhado.

${profileText}

IMPORTANTE: Responda APENAS com um JSON válido, sem texto antes ou depois, sem markdown. Use exatamente este formato:
{
  "calories": 2500,
  "protein": 150,
  "carbs": 300,
  "fat": 70,
  "goal": "objetivo resumido da dieta",
  "meals": [
    {
      "name": "Café da manhã",
      "time": "07:00",
      "calories": 500,
      "foods": [
        { "name": "Ovo mexido", "amount": "3 unidades", "protein": 18, "carbs": 1, "fat": 12 }
      ]
    }
  ],
  "tips": ["dica 1", "dica 2"]
}`;
  }

  return `Você é um personal trainer e nutricionista esportivo especialista com vasto conhecimento baseado nas melhores evidências científicas e práticas atuais da área.

${profileText}

COMO RESPONDER:
- Seja direto e objetivo — responda a pergunta principal logo na primeira linha
- Use bullet points ou listas curtas quando listar mais de 2 itens
- Sem introduções longas, sem repetir o que o usuário disse
- Máximo de 150 palavras por resposta, exceto quando pedir explicação detalhada
- Baseie respostas em evidências científicas
- Responda sempre em português brasileiro
- Tom: direto, motivador, sem exagero

MODIFICAÇÃO DE PLANOS (USE SOMENTE QUANDO O USUÁRIO PEDIR ALTERAÇÕES):
Se o usuário pedir para trocar/remover/adicionar um exercício OU alimento/refeição, faça a alteração e retorne EXATAMENTE neste formato:
1. Explicação breve do que mudou (1-2 frases)
2. Se alterou treino: <<<WORKOUT_UPDATE>>>JSON_COMPLETO_DO_PLANO<<<END>>>
3. Se alterou dieta: <<<DIET_UPDATE>>>JSON_COMPLETO_DO_PLANO<<<END>>>
O JSON deve ser o plano COMPLETO atualizado no mesmo formato original.`;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const { messages, profile, mode = "chat", workout_plan, diet_plan } = await req.json();

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GROQ_API_KEY não configurada." }, { status: 503 });
    }

    const response = await fetch(GROQ_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: buildSystemPrompt(profile || {}, mode) +
            (mode === "chat" && (workout_plan || diet_plan)
              ? `\n\nPLANO DE TREINO ATUAL DO USUÁRIO:\n${workout_plan ? JSON.stringify(workout_plan) : "Nenhum"}\n\nPLANO ALIMENTAR ATUAL DO USUÁRIO:\n${diet_plan ? JSON.stringify(diet_plan) : "Nenhum"}`
              : "")
          },
          ...messages.map((m: { role: string; content: string }) => ({
            role: m.role,
            content: m.content,
          })),
        ],
        max_tokens: 4096,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || "Erro na API Groq" }, { status: response.status });
    }

    let text: string = data.choices?.[0]?.message?.content ?? "";
    // Remove blocos markdown caso o modelo os retorne
    text = text.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();

    // Salva plano no Supabase (geração direta)
    if (mode === "workout" || mode === "diet") {
      try {
        const parsed = JSON.parse(text);
        const col = mode === "workout" ? "workout_plan" : "diet_plan";
        await supabase.from("users").update({ [col]: parsed }).eq("id", user.id);
      } catch { /* JSON inválido — ignora */ }
    }

    // Detecta modificações de plano vindas do chat
    let workoutUpdate: Record<string, unknown> | null = null;
    let dietUpdate: Record<string, unknown> | null = null;

    if (mode === "chat") {
      const wMatch = text.match(/<<<WORKOUT_UPDATE>>>([\s\S]*?)<<<END>>>/);
      const dMatch = text.match(/<<<DIET_UPDATE>>>([\s\S]*?)<<<END>>>/);

      if (wMatch) {
        try {
          workoutUpdate = JSON.parse(wMatch[1].trim());
          await supabase.from("users").update({ workout_plan: workoutUpdate }).eq("id", user.id);
        } catch { /* ignora */ }
      }
      if (dMatch) {
        try {
          dietUpdate = JSON.parse(dMatch[1].trim());
          await supabase.from("users").update({ diet_plan: dietUpdate }).eq("id", user.id);
        } catch { /* ignora */ }
      }

      // Remove os marcadores do texto exibido
      text = text
        .replace(/<<<WORKOUT_UPDATE>>>[\s\S]*?<<<END>>>/g, "")
        .replace(/<<<DIET_UPDATE>>>[\s\S]*?<<<END>>>/g, "")
        .trim();
    }

    return NextResponse.json({ text, workoutUpdate, dietUpdate });
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
