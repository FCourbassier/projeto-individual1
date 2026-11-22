async function carregarDashboard() {

    try {

        const resposta = await fetch("/dashboard/dados");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar dados.");
        }

        const dados = await resposta.json();

        // Atualiza os quatro indicadores
        document.getElementById("cidadeDestaque").textContent =
            dados.cidades[0]?.nome || "Sem dados";

        document.getElementById("epocaDestaque").textContent =
            dados.epocas[0]?.nome || "Sem dados";

        document.getElementById("pontoDestaque").textContent =
            dados.pontos[0]?.nome || "Sem dados";

        document.getElementById("motivoDestaque").textContent =
            dados.motivos[0]?.nome || "Sem dados";


        // Cores utilizadas nos gráficos
        const cores = [
            "#f4c45e",
            "#147f88",
            "#5b91b8",
            "#d98b55",
            "#a6b98b",
            "#9b82b5",
            "#c96b50"
        ];


        // Função responsável por criar os gráficos
       function criarGrafico(id, tipo, dadosGrafico) {

    const elemento = document.getElementById(id);

    if (!elemento || !dadosGrafico || dadosGrafico.length === 0) {
        return;
    }

    const cores = [
        "#f4c45e",
        "#147f88",
        "#5b91b8",
        "#d98b55",
        "#a6b98b",
        "#9b82b5",
        "#c96b50"
    ];

    new Chart(elemento, {

    type: tipo,

    data: {
        labels: dadosGrafico.map(item => item.nome),

        datasets: [{
            label: "Respostas",
            data: dadosGrafico.map(item => Number(item.total)),
            backgroundColor: cores,
            borderColor: "#1b3d5c",
            borderWidth: 3,
            borderRadius: tipo === "doughnut" ? 3 : 5,
            hoverOffset: 8,
            spacing: tipo === "doughnut" ? 3 : 0
        }]
    },

    plugins: tipo === "doughnut" ? [{
        id: "totalCentro",

        afterDraw(chart) {
            const { ctx, chartArea } = chart;

            if (!chartArea) return;

            const total = chart.data.datasets[0].data
                .reduce((soma, valor) => soma + Number(valor), 0);

            const x = (chartArea.left + chartArea.right) / 2;
            const y = (chartArea.top + chartArea.bottom) / 2;

            ctx.save();
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 22px Arial";
            ctx.fillText(total, x, y - 7);

            ctx.fillStyle = "#f4c45e";
            ctx.font = "10px Arial";
            ctx.fillText("respostas", x, y + 12);

            ctx.restore();
        }
    }] : [],

    options: {
        responsive: true,
        maintainAspectRatio: false,

        indexAxis: tipo === "bar" ? "y" : "x",

        cutout: tipo === "doughnut" ? "65%" : undefined,

        plugins: {
            legend: {
                display: tipo !== "bar",
                position: "bottom",

                labels: {
                    color: "#ffffff",
                    usePointStyle: true,
                    pointStyle: "circle",
                    boxWidth: 8,
                    boxHeight: 8,
                    padding: 9,
                    font: {
                        size: 9
                    }
                }
            },

            tooltip: {
                callbacks: {
                    label: function(context) {
                        return "Respostas: " + context.raw;
                    }
                }
            }
        },

        scales: tipo === "bar" ? {

            x: {
                beginAtZero: true,
                ticks: {
                    color: "#ffffff",
                    precision: 0,
                    font: { size: 9 }
                },
                grid: {
                    color: "rgba(255,255,255,0.10)"
                }
            },

            y: {
                ticks: {
                    color: "#ffffff",
                    autoSkip: false,
                    font: { size: 9 },
                    callback: function(value) {
                        const texto = this.getLabelForValue(value);
                        const palavras = texto.split(" ");
                        const linhas = [];
                        let linha = "";

                        palavras.forEach(function(palavra) {
                            if ((linha + " " + palavra).trim().length > 19) {
                                if (linha) linhas.push(linha);
                                linha = palavra;
                            } else {
                                linha += (linha ? " " : "") + palavra;
                            }
                        });

                        if (linha) linhas.push(linha);
                        return linhas;
                    }
                },
                grid: {
                    display: false
                }
            }

        } : {}
    }

});
}


        // Criação dos sete gráficos
        criarGrafico(
            "graficoEpocas",
            "doughnut",
            dados.epocas
        );

        criarGrafico(
            "graficoConhecimento",
            "bar",
            dados.conhecimento
        );

        criarGrafico(
            "graficoPontos",
            "bar",
            dados.pontos
        );

        criarGrafico(
            "graficoCidades",
            "bar",
            dados.cidades
        );

        criarGrafico(
            "graficoNatureza",
            "doughnut",
            dados.natureza
        );

        criarGrafico(
            "graficoCultura",
            "doughnut",
            dados.cultura
        );

        criarGrafico(
            "graficoMotivos",
            "bar",
            dados.motivos
        );


        // Exibe as respostas abertas da pergunta 8
        const listaRespostas =
            document.getElementById("listaRespostas");

        listaRespostas.innerHTML = "";

        if (
            !dados.respostasAbertas ||
            dados.respostasAbertas.length === 0
        ) {

            listaRespostas.textContent =
                "Nenhuma resposta registrada.";

        } else {

            dados.respostasAbertas.forEach(function (resposta) {

                const paragrafo = document.createElement("p");

                paragrafo.textContent =
                    resposta.resposta_texto;

                listaRespostas.appendChild(paragrafo);

            });

        }

    } catch (erro) {

        console.error("Erro ao carregar dashboard:", erro);

        alert("Não foi possível carregar os dados do dashboard.");

    }

}

carregarDashboard();