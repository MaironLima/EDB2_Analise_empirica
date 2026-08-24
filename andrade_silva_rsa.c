// Gera números Aleatórios "n" de "b" bits
// para gerar os primos e a chave privada
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <gmp.h> // Importa a biblioteca GMP

gmp_randstate_t state;
gmp_randinit_default (state);
gmp_randseed_ui(state, rand());
mpz_urandomb (n, state, b);
gmp_randclear(state);

// Calcula n=p*q
mpz_mul(n,p,q);

// Calcula a funcao de Euler fi(n)=(p-1)(q-1)
mpz_sub_ui(s1,p,1);
mpz_sub_ui(s2,q,1);
mpz_mul(fn,s1,s2);

// Algoritmo de Euclides Estendido para gerar a chave privada "d"
// "inv" <- a' tal que A*a' = 1(mod b)
while(mpz_cmp_ui(B,0)>0)
{
    mpz_fdiv_qr(q,r,A,B);
    mpz_mul(p, q,x1);
    mpz_sub(x, x2, p);
    mpz_set(A, B);
    mpz_set(B, r);
    mpz_set(x2,x1);
    mpz_set(x1,x);
}
if(mpz_cmp_ui(x2,0)<0) mpz_add(x2, x2,b);
mpz_set(inv,x2); // "inv" recebe "x2"

// Calcula a Potencia modular para cifrar e decifrar
// result <- a^e mod m
mpz_fdiv_qr(exp, r, exp, dois);
if(mpz_cmp_ui(r, 1) == 0)
    mpz_set(b, a);
while(mpz_cmp_ui(exp,0)!=0) // Enquanto "m" for diferente de 0
{
    mpz_fdiv_qr(exp, r, exp,dois); // Converte gradativamente "m"
    mpz_mul(A,A,A);
    // para binário
    mpz_fdiv_r(A,A,m);
    if(mpz_cmp_ui(r,1) == 0) {
        mpz_mul(b,A,b);
        mpz_fdiv_r(b,b,m);
    }
}
mpz_set(result,b); // "result" recebe "b"

// Transforma os caracteres da mensagem para o código ASCII
// Forma um número "m" contendo os caracteres em ASCII
for(i=strlen(s)-1; i>=0; i--)
{
    mpz_mul_ui(m,m, 1000);
    j=s[i];
    if(j<0) j=j+256;
    mpz_add_ui(m,m,j);
}

// Transforma o código ASCII em caracteres
while(mpz_cmp_ui(M,1000)>0)
{
    MensDec[k]=mpz_fdiv_q_ui(M, M, 1000);
    k++;
}

// Algoritmo de Euclides - verifica se dois números sao primos entre si
// Se MDC(a,b) = 1 retorna 1, Se MDC(a,b) !=1 retorna 0
do {
    mpz_fdiv_r(r, A,B);
    mpz_set(A, B);
    mpz_set(B, r);
} while(mpz_cmp_ui(B,0)!=0);

if(mpz_cmp_ui(A,1)==0) {
    // Se A=1 retorna 1
    return 1;
}
else {
    // Se A!=1 retorna 0
    return 0;
}