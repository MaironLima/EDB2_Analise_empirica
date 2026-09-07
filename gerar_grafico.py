import pandas as pd
import matplotlib.pyplot as plt

# 1. Leitura dos dados (arquivos separados por ponto e vírgula)
df_aes = pd.read_csv('aes_resultados.csv', sep=';')
df_rsa = pd.read_csv('rsa_resultados.csv', sep=';')

# 2. Agrupamento e cálculo da média para cada tamanho de N
media_aes = df_aes.groupby('Tamanho da mensagem')['Tempo (ms)'].mean()
media_rsa = df_rsa.groupby('Tamanho da mensagem')['Tempo (ms)'].mean()

# 3. Normalização (escala de 0.0 a 1.0) - mantida para referência,
#    mas ATENÇÃO: isso só mostra o FORMATO do crescimento de cada
#    algoritmo em relação a si mesmo. Não serve para comparar
#    quem é mais rápido, pois cada curva é dividida pelo seu
#    próprio valor máximo.
aes_norm = media_aes / media_aes.max()
rsa_norm = media_rsa / media_rsa.max()

# 4. Configuração visual com DOIS gráficos lado a lado
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 6))

# ---- Gráfico 1: TEMPO ABSOLUTO (escala log no eixo Y) ----
# Esse é o gráfico que realmente responde "qual algoritmo é mais
# lento e como essa diferença muda com o tamanho da entrada".
ax1.plot(media_aes.index, media_aes.values, marker='o', linewidth=2,
          label='AES', color='blue')
ax1.plot(media_rsa.index, media_rsa.values, marker='o', linewidth=2,
          label='RSA', color='red')
ax1.set_yscale('log')  # escala log é necessária pois RSA é ~20x mais lento
ax1.set_title('Tempo ABSOLUTO de criptografia (escala log)', fontsize=13)
ax1.set_xlabel('Tamanho da Mensagem (Caracteres)', fontsize=11)
ax1.set_ylabel('Tempo (ms) - escala logarítmica', fontsize=11)
ax1.legend()
ax1.grid(True, linestyle='--', alpha=0.6, which='both')

# ---- Gráfico 2: TEMPO NORMALIZADO (formato do crescimento) ----
# Esse gráfico só serve para comparar o FORMATO da curva (ex: se
# ambos crescem de forma linear), não para comparar velocidade.
ax2.plot(aes_norm.index, aes_norm.values, marker='o', linewidth=2,
          label='AES (normalizado)', color='blue')
ax2.plot(rsa_norm.index, rsa_norm.values, marker='o', linewidth=2,
          label='RSA (normalizado)', color='red')
ax2.set_title('Formato do crescimento (normalizado 0-1)', fontsize=13)
ax2.set_xlabel('Tamanho da Mensagem (Caracteres)', fontsize=11)
ax2.set_ylabel('Tempo Normalizado (0.0 a 1.0)', fontsize=11)
ax2.legend()
ax2.grid(True, linestyle='--', alpha=0.6)

plt.suptitle('Análise Assintótica: AES vs RSA', fontsize=15)
plt.tight_layout()

# 5. Exportação da imagem em alta qualidade (300 dpi)
plt.savefig('grafico_assintotico.png', dpi=300, bbox_inches='tight')
print("Gráfico salvo com sucesso: grafico_assintotico.png")

# 6. Exibe também os dados numéricos no terminal, para conferência
print("\n=== Tempo médio (ms) por tamanho de mensagem ===")
comparacao = pd.DataFrame({'AES (ms)': media_aes, 'RSA (ms)': media_rsa})
comparacao['RSA / AES (quantas vezes mais lento)'] = comparacao['RSA (ms)'] / comparacao['AES (ms)']
print(comparacao)