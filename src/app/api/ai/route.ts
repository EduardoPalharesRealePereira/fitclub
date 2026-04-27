import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ANTHROPIC_API = "https://api.anthropic.com/v1/messages";

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
    return `Você é um personal trainer especialista com 15 anos de experiência. Com base nos dados do cliente abaixo, crie uma ficha de treino semanal detalhada.

${profileText}

IMPORTANTE: Responda APENAS com um JSON válido, sem texto antes ou depois. Use exatamente este formato:
{
  "name": "Nome da ficha (ex: Hipertrofia Intermediária 5x)",
  "frequency": "X dias por semana",
  "goal": "objetivo resumido",
  "days": [
    {
      "day": "Segunda-feira",
      "focus": "Peito e Tríceps",
      "exercises": [
        {
          "name": "Nome do exercício",
          "sets": 4,
          "reps": "8-12",
          "rest": "90s",
          "tip": "dica técnica curta"
        }
      ]
    }
  ]
}`;
  }

  if (mode === "diet") {
    return `Você é um nutricionista esportivo especialista. Com base nos dados do cliente abaixo, crie um plano alimentar diário detalhado.

${profileText}

IMPORTANTE: Responda APENAS com um JSON válido, sem texto antes ou depois. Use exatamente este formato:
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

  return `Você é um personal trainer e nutricionista esportivo especialista, simpático e motivador. Responda em português brasileiro de forma clara, direta e encorajadora. Você tem acesso ao perfil do cliente:

${profileText}

Ajude o cliente com dúvidas sobre treino, dieta, suplementação e bem-estar. Seja objetivo e prático.`;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const { messages, profile, mode = "chat" } = await req.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === "sua-chave-anthropic-aqui") {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY não configurada. Adicione sua chave no .env.local" },
        { status: 503 }
      );
    }

    const response = await fetch(ANTHROPIC_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 4096,
        system: buildSystemPrompt(profile || {}, mode),
        messages,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || "Erro na API" }, { status: response.status });
    }

    const text = data.content?.[0]?.text ?? "";

    // Salva plano no Supabase se for geração de ficha/dieta
    if (mode === "workout" || mode === "diet") {
      try {
        const parsed = JSON.parse(text);
        const col = mode === "workout" ? "workout_plan" : "diet_plan";
        await supabase.from("users").update({ [col]: parsed }).eq("id", user.id);
      } catch {}
    }

    return NextResponse.json({ text });
  } catch (err) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
