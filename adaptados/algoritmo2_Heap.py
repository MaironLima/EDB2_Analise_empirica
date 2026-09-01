def permute_heap_sedgewick(P):
    N = len(P)
    
    # Vetor criado com tamanho N+1 para suportar a indexação de 1 a N do artigo
    c = [0] * (N + 1) 
    
    i = N
    # Equivalente a: loop: c[i]:=1 while i>2; i:=i-1 repeat;
    while True:
        c[i] = 1
        if i <= 2:
            break
        i -= 1
        
    # Equivalente a: process;
    print(P) 
    
    # Equivalente a: loop ... while i <= N repeat;
    while i <= N:
        if c[i] < i:
            # Equivalente a: if i odd then k:=1 else k:=c[i] endif;
            if i % 2 != 0:
                k = 1
            else:
                k = c[i]
            
            # Equivalente a: P[i] :=: P[k]; 
            P[i - 1], P[k - 1] = P[k - 1], P[i - 1]
            
            # Equivalente a: c[i] := c[i] + 1; i:=2;
            c[i] += 1
            i = 2
            
            # Equivalente a: process;
            print(P)
        else:
            # Equivalente a: else c[i] := 1; i:=i+1
            c[i] = 1
            i += 1