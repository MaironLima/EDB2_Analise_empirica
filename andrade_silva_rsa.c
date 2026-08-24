#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <gmp.h> // Importa a biblioteca GMP

int main() {
    // 1. Declaração das Variáveis Padrão
    unsigned long int b_bits = 1024; // Representa o "b" (tamanho em bits)
    int i, j, k = 0;
    char s[] = "TESTE RSA"; 
    char MensDec[1000];

    // 2. Declaração das Variáveis GMP (Números Gigantes)
    mpz_t n, p, q_primo, s1, s2, fn, A, B, x, x1, x2, r, inv, exp, dois, a, b_mpz, m, result, M, quociente, p_temp;
    
    // 3. Inicialização das Variáveis GMP
    mpz_inits(n, p, q_primo, s1, s2, fn, A, B, x, x1, x2, r, inv, exp, dois, a, b_mpz, m, result, M, quociente, p_temp, NULL);

    // ========================================================================
    // LÓGICA DO ALGORITMO RSA
    // ========================================================================

    // Inicializa gerador de números Aleatórios para "n" de "b_bits" bits
    gmp_randstate_t state;
    gmp_randinit_default(state);
    gmp_randseed_ui(state, time(NULL)); // Usando time(NULL) para seed real
    mpz_urandomb(n, state, b_bits);
    gmp_randclear(state);

    // Calcula n = p * q_primo
    mpz_mul(n, p, q_primo);

    // Calcula a funcao de Euler fi(n) = (p-1)(q-1)
    mpz_sub_ui(s1, p, 1);
    mpz_sub_ui(s2, q_primo, 1);
    mpz_mul(fn, s1, s2);

    // Algoritmo de Euclides Estendido para gerar a chave privada "d"
    // "inv" <- a' tal que A*a' = 1(mod b_mpz)
    while(mpz_cmp_ui(B, 0) > 0)
    {
        mpz_fdiv_qr(quociente, r, A, B); // Usando 'quociente' ao invés de 'q'
        mpz_mul(p_temp, quociente, x1);  // Usando 'p_temp' ao invés de 'p'
        mpz_sub(x, x2, p_temp);
        
        mpz_set(A, B);
        mpz_set(B, r);
        mpz_set(x2, x1);
        mpz_set(x1, x);
    }
    
    if(mpz_cmp_ui(x2, 0) < 0) {
        mpz_add(x2, x2, b_mpz); 
    }
    mpz_set(inv, x2); // "inv" recebe "x2"

    // Calcula a Potencia modular para cifrar e decifrar
    // result <- a^e mod m
    mpz_fdiv_qr(exp, r, exp, dois);
    
    if(mpz_cmp_ui(r, 1) == 0) {
        mpz_set(b_mpz, a);
    } else {
        mpz_set_ui(b_mpz, 1); // Fallback padrão
    }

    while(mpz_cmp_ui(exp, 0) != 0) // Enquanto "exp" for diferente de 0
    {
        mpz_fdiv_qr(exp, r, exp, dois); // Converte gradativamente
        mpz_mul(A, A, A);
        
        mpz_fdiv_r(A, A, m);
        
        if(mpz_cmp_ui(r, 1) == 0) {
            mpz_mul(b_mpz, A, b_mpz);
            mpz_fdiv_r(b_mpz, b_mpz, m);
        }
    }
    mpz_set(result, b_mpz); // "result" recebe "b_mpz"

    // Transforma os caracteres da mensagem para o código ASCII
    // Forma um número "m" contendo os caracteres em ASCII
    mpz_set_ui(m, 0); // Garantindo que 'm' parta do zero
    for(i = strlen(s) - 1; i >= 0; i--)
    {
        mpz_mul_ui(m, m, 1000);
        j = s[i];
        if(j < 0) j = j + 256;
        mpz_add_ui(m, m, j);
    }

    // Transforma o código ASCII em caracteres
    k = 0;
    while(mpz_cmp_ui(M, 1000) > 0)
    {
        MensDec[k] = mpz_fdiv_q_ui(M, M, 1000);
        k++;
    }
    MensDec[k] = '\0'; // Fecha a string corretamente

    // Algoritmo de Euclides - verifica se dois números sao primos entre si
    do {
        mpz_fdiv_r(r, A, B);
        mpz_set(A, B);
        mpz_set(B, r);
    } while(mpz_cmp_ui(B, 0) != 0);

    // Em vez de dar return 1 ou 0 no meio do main, salvamos o resultado
    int sao_primos_entre_si = 0;
    if(mpz_cmp_ui(A, 1) == 0) {
        sao_primos_entre_si = 1; // Se A=1 retorna 1
    } else {
        sao_primos_entre_si = 0; // Se A!=1 retorna 0
    }

    // ========================================================================
    // LIMPEZA FINAL
    // ========================================================================
    
    mpz_clears(n, p, q_primo, s1, s2, fn, A, B, x, x1, x2, r, inv, exp, dois, a, b_mpz, m, result, M, quociente, p_temp, NULL);

    printf("Programa executado com sucesso!\n");
    return 0;
}