async function carregarDashboard() {
    try {
        const resposta = await fetch("/dashboard/dados");
        if (!resposta.ok) {
            throw new Error("Erro ao buscar dados.");
        }
        const dados = await resposta.json();
        // Atualiza as quatro KPIs
        document.getElementById("cidadeDestaque").textContent =
            dados.cidades[0]?.nome || "Sem dados";
        document.getElementById("epocaDestaque").textContent =
            dados.epocas[0]?.nome || "Sem dados";
        document.getElementById("pontoDestaque").textContent =
            dados.pontos[0]?.nome || "Sem dados";
        document.getElementById("motivoDestaque").textContent =
            dados.motivos[0]?.nome || "Sem dados";
        // Cria os gráficos com Chart.js
        function criarGrafico(id, tipo, dadosGrafico) {
            new Chart(document.getElementById(id), {
                type: tipo,
                data: {
                    labels: dadosGrafico.map(item => item.nome),
                    datasets: [{
                        label: "Quantidade de respostas",
                        data: dadosGrafico.map(item => Number(item.total)),
                        backgroundColor: [
                            "#f4c45e",
                            "#147f88",
                            "#5b91b8",
                            "#d98b55",
                            "#a6b98b",
                            "#9b82b5",
                            "#c96b50"
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: "bottom",
                            labels: {
                                color: "#ffffff"
                            }
                        }
                    },
                    scales: tipo === "bar" ? {
                        x: {
                            ticks: {
                                color: "#ffffff"
                            }
                        },
                        y: {
                            beginAtZero: true,
                            ticks: {
                                color: "#ffffff",
                                precision: 0
                            }
                        }
                    } : {}
                }
            });
        }
        // Exibe somente os dois gráficos
        criarGrafico("graficoCidades", "bar", dados.cidades);
        criarGrafico("graficoEpocas", "doughnut", dados.epocas);
        // Exibe as respostas abertas da pergunta 8
        const listaRespostas = document.getElementById("listaRespostas");
        listaRespostas.innerHTML = "";
        if (dados.respostasAbertas.length === 0) {
            listaRespostas.textContent = "Nenhuma resposta registrada.";
        } else {
            dados.respostasAbertas.forEach(function (resposta) {
                const paragrafo = document.createElement("p");
                paragrafo.textContent = resposta.resposta_texto;
                listaRespostas.appendChild(paragrafo);
            });
        }
    } catch (erro) {
        console.error("Erro ao carregar dashboard:", erro);
        alert("Não foi possível carregar os dados da dashboard.");
    }
}
carregarDashboard();