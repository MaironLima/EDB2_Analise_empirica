def algorithm_7_fischer_krause(P, N):
    # P[N+1] := infinity;
    # Adicionamos um valor infinito ao final da lista para a condição de parada.
    P.append(float('inf'))
    
    # process;
    print(P[:N])
    
    # loop:
    while True:
        # i := 2; 
        # (Índice 1 em Python representa o segundo elemento)
        i = 1 
        
        # loop while P[i] < P[i-1]: i := i + 1 repeat;
        while P[i] < P[i-1]:
            i += 1
            
        # while i <= N
        # Se i ultrapassar o limite do vetor original, o laço é encerrado.
        if i >= N: 
            break
            
        # j := 1;
        # (Índice 0 em Python representa o primeiro elemento)
        j = 0 
        
        # loop while P[j] > P[i]: j := j + 1 repeat;
        while P[j] > P[i]:
            j += 1
            
        # P[i] :=: P[j];
        P[i], P[j] = P[j], P[i]
        
        # reverse(i-1);
        # A operação reverse inverte a ordem dos elementos até i-1.
        P[:i] = reversed(P[:i])
        
        # process;
        print(P[:N])

# Exemplo de uso com um vetor P fornecido externamente:
# vetor = [1, 2, 3, 4]
# algorithm_7_fischer_krause(vetor, 4)