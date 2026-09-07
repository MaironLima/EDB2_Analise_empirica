import pandas as pd
import matplotlib.pyplot as plt

# 1. Leitura dos dados
df_aes = pd.read_csv('aes_resultados.csv', sep=';')
df_rsa = pd.read_csv('rsa_resultados.csv', sep=';')

media_aes = df_aes.groupby('Tamanho da mensagem')['Tempo (ms)'].mean().sort_index()
media_rsa = df_rsa.groupby('Tamanho da mensagem')['Tempo (ms)'].mean().sort_index()

# 2. Gráfico em escala LOG-LOG
# (permite comparar o FORMATO do crescimento dos dois algoritmos,
# mesmo com magnitudes de tempo tão diferentes entre eles)
plt.figure(figsize=(10, 6))

plt.plot(media_aes.index, media_aes.values, marker='o', markersize=9,
         linewidth=3, color='#2563eb', label='AES')

plt.plot(media_rsa.index, media_rsa.values, marker='o', markersize=9,
         linewidth=3, color='#dc2626', label='RSA')

# Preenchimento ENTRE as duas curvas (em vez de até o zero, que não
# existe em escala log) - destaca visualmente a diferença entre elas
plt.fill_between(media_aes.index, media_aes.values, media_rsa.values,
                  color='#dc2626', alpha=0.08)

# 3. Ativando a escala logarítmica nos dois eixos
plt.xscale('log')
plt.yscale('log')

# 4. Anotação destacando a diferença no último ponto
ultimo_n = media_aes.index[-1]
tempo_aes_final = media_aes.values[-1]
tempo_rsa_final = media_rsa.values[-1]
razao = tempo_rsa_final / tempo_aes_final

plt.annotate(
    f'{razao:.0f}x mais lento',
    xy=(ultimo_n, tempo_rsa_final),
    xytext=(-140, 10), textcoords='offset points',
    fontsize=13, fontweight='bold', color='#dc2626'
)

# 5. Estilo visual limpo, focado em apresentação
plt.title('Tempo de criptografia x tamanho da mensagem (escala log-log)',
          fontsize=16, fontweight='bold', pad=15)
plt.xlabel('Tamanho da mensagem (n) - escala log', fontsize=13)
plt.ylabel('Tempo (ms) - escala log', fontsize=13)

plt.legend(fontsize=13, loc='upper left', frameon=False)
plt.grid(True, which='both', linestyle='--', alpha=0.3)

# Remove bordas desnecessárias (visual mais limpo para slide)
ax = plt.gca()
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)

plt.tight_layout()
plt.savefig('grafico_assintotico.png', dpi=300, bbox_inches='tight')
print("Gráfico salvo com sucesso: grafico_assintotico.png")