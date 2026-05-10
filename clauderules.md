# CLAUDE.md — Vozes Contra o Silêncio
## Café Filosófico IFPE · 16.05.2026

Este arquivo instrui o Claude Code sobre a estrutura, responsabilidades e tarefas deste projeto.

---

## Descrição do Projeto

Apresentação web imersiva sobre feminicídio no Brasil para o 4º Encontro do Café Filosófico no IFPE Vitória. Roda localmente no Chrome em modo tela cheia. Sem servidor necessário — apenas abrir `index.html`.

---

## Estrutura de Diretórios

```
apresentacao-ifpe/
│
├── index.html                  ← estrutura HTML apenas (sem CSS/JS inline)
│
├── css/
│   └── style.css               ← todos os estilos da apresentação
│
├── js/
│   └── app.js                  ← toda a lógica de navegação e áudio
│
├── videos/
│   ├── video_vela.mp4          ← vídeo Veo: vela no escuro (slides 1 e 13)
│   ├── video_lagrima.mp4       ← vídeo Veo: lágrima em close (slide 2)
│   ├── video_cadeira.mp4       ← vídeo Veo: cadeira vazia (slide 5)
│   └── video_instagram.mp4     ← vídeo baixado do Instagram (slide 12) ⚠️ RENOMEAR
│
├── audio/
│   ├── s01.mp3                 ← narração slide 1  · "Hoje, enquanto você toma..."
│   ├── s02.mp3                 ← narração slide 2  · "Em 2025, mil quinhentas..."
│   ├── s04.mp3                 ← narração slide 4  · "Pernambuco. O estado que..."
│   ├── s05.mp3                 ← narração slide 5  · "Em Jaboatão dos Guararapes..."
│   ├── s06.mp3                 ← narração slide 6  · "A Lei Maria da Penha..."
│   ├── s07.mp3                 ← narração slide 7  · "Elas não eram estatísticas..."
│   ├── s08.mp3                 ← narração slide 8  · "São Paulo. O estado mais rico..."
│   └── s10.mp3                 ← narração slide 10 · "Se você está em perigo..."
│
└── CLAUDE.md                   ← este arquivo
```

---

## Mapa de Slides

| # | Slide | Áudio | Vídeo BG | Duração |
|---|---|---|---|---|
| 1 | Abertura — 1.568 | `s01.mp3` → avança ao terminar | video_vela | fallback 20s |
| 2 | Brasil — dados nacionais | `s02.mp3` → avança ao terminar | video_lagrima | fallback 22s |
| 3 | Contador ao vivo 2026 | — timer | — | 10s |
| 4 | Pernambuco — dados | `s04.mp3` → avança ao terminar | — | fallback 22s |
| 5 | Pernambuco — casos reais | `s05.mp3` → avança ao terminar | video_cadeira | fallback 30s |
| 6 | Lei Maria da Penha | `s06.mp3` → avança ao terminar | — | fallback 22s |
| 7 | Perfil das vítimas | `s07.mp3` → avança ao terminar | — | fallback 35s |
| 8 | São Paulo | `s08.mp3` → avança ao terminar | — | fallback 28s |
| 9 | Quote + pétalas CSS | — timer | — | 10s |
| 10 | Chamada para ação | `s10.mp3` → avança ao terminar | — | fallback 28s |
| 11 | Pré-título vídeo Instagram | — timer | — | 8s |
| 12 | Vídeo Instagram com som | — vídeo termina → avança | video_instagram (COM SOM) | fallback 120s |
| 13 | Encerramento — IFPE | — timer | video_vela | 12s |

---

## Como Funciona a Lógica de Áudio (app.js)

```
goTo(idx)
  ├── Slide com data-audio="sXX.mp3"
  │     └── new Audio('audio/sXX.mp3').play()
  │         onended → goTo(current + 1)
  │
  ├── Slide com class="instagram-slide"
  │     └── video.muted = false → video.play()
  │         onended → goTo(current + 1)
  │
  └── Slide sem áudio (data-duration="N")
        └── setTimeout(N * 1000) → goTo(current + 1)
```

---

## Tarefas Para o Claude Code

### Tarefa Principal — Verificar e Validar

```bash
# Verificar se todos os arquivos esperados existem
ls videos/ audio/ css/ js/
```

Se algum arquivo de áudio ou vídeo estiver faltando, liste quais faltam e informe o usuário.

### Tarefa — Servir Localmente (se necessário)

Alguns navegadores bloqueiam áudio de arquivos `file://`. Se acontecer, sirva localmente:

```bash
# Python 3
python3 -m http.server 8080

# Node (se disponível)
npx serve .
```

Depois abrir: `http://localhost:8080`

### Tarefa — Adicionar novo slide

Para adicionar um slide novo, editar `index.html`:
- Inserir novo `<div class="slide">` na posição correta dentro de `#slides`
- Se tiver narração: adicionar `data-audio="sNN.mp3"` e colocar o MP3 em `audio/`
- Se for visual: adicionar `data-duration="N"` com o tempo em segundos
- Atualizar o contador `1 / 13` no `#slideNum` se necessário (o JS conta automaticamente)

### Tarefa — Ajustar tempo de um slide

Editar o `data-duration` do slide em `index.html`. O `data-duration` é usado apenas como fallback — se houver `data-audio`, o áudio manda.

### Tarefa — Trocar vídeo de fundo

Substituir o arquivo em `videos/` pelo novo (mesmo nome), ou atualizar o `src` no `<video>` correspondente no `index.html`.

---

## Controles Durante a Apresentação

| Tecla | Ação |
|---|---|
| `Enter` | Inicia a apresentação |
| `→` ou `Espaço` | Próximo slide |
| `←` | Slide anterior |
| `Esc` | Pausa/retoma o avanço automático |
| Clique nos dots | Vai para o slide clicado |

---

## Notas de Produção

- **Fonte:** Google Fonts (requer internet no primeiro carregamento)
- **Áudio:** gerado no ElevenLabs · voz Fernanda · Stability 35 · Style 45
- **Vídeos de fundo:** gerados no Veo (Google)
- **Vídeo Instagram:** renomear para `video_instagram.mp4` e colocar em `videos/`
- **Resolução recomendada:** 1920×1080 · Chrome em tela cheia (F11)
- **Sem dependências externas** além das Google Fonts — projeto 100% offline após cache

---

## Avisos

⚠️ O vídeo `videos/video_instagram.mp4` **toca COM SOM** (não é muted). Certifique-se de que o volume da máquina está configurado antes de iniciar.

⚠️ Slides com `data-audio` **não avançam por timer** — eles avançam quando o áudio termina. Se um arquivo `.mp3` estiver faltando, o slide ficará parado. Verifique todos os arquivos antes do evento.
