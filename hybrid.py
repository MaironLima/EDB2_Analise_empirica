import numpy as np

def matrix_chain_order(p):
    n = len(p) - 1  # Número de matrizes
    m = np.full((n, n), float('inf'))  # Tabela de custos
    s = np.zeros((n, n), dtype=int)    # Tabela de parentesagem
    
    for i in range(n):
        m[i, i] = 0  # Custo de multiplicar uma matriz é zero
        
    for chain_length in range(2, n + 1):  # Comprimento da cadeia de 2 até n
        for i in range(n - chain_length + 1):
            j = i + chain_length - 1
            for k in range(i, j):
                cost = m[i, k] + m[k + 1, j] + p[i] * p[k + 1] * p[j + 1]
                if cost < m[i, j]:
                    m[i, j] = cost
                    s[i, j] = k
                    
    return m, s

def strassen_matrix_multiply(A, B):
    n = A.shape[0]
    if n <= 1:
        return A * B
        
    mid = n // 2
    A11, A12, A21, A22 = A[:mid, :mid], A[:mid, mid:], A[mid:, :mid], A[mid:, mid:]
    B11, B12, B21, B22 = B[:mid, :mid], B[:mid, mid:], B[mid:, :mid], B[mid:, mid:]
    
    M1 = strassen_matrix_multiply(A11 + A22, B11 + B22)
    M2 = strassen_matrix_multiply(A21 + A22, B11)
    M3 = strassen_matrix_multiply(A11, B12 - B22)
    M4 = strassen_matrix_multiply(A22, B21 - B11)
    M5 = strassen_matrix_multiply(A11 + A12, B22)
    M6 = strassen_matrix_multiply(A21 - A11, B11 + B12)
    M7 = strassen_matrix_multiply(A12 - A22, B21 + B22)
    
    C11 = M1 + M4 - M5 + M7
    C12 = M3 + M5
    C21 = M2 + M4
    C22 = M1 - M2 + M3 + M6
    
    C = np.vstack((np.hstack((C11, C12)), np.hstack((C21, C22))))
    return C

def hybrid_matrix_chain_multiplication(p, matrices):
    m, s = matrix_chain_order(p)
    n = len(matrices)
    
    def multiply_recursive(i, j):
        if i == j:
            return matrices[i]
        k = s[i, j]
        A = multiply_recursive(i, k)
        B = multiply_recursive(k + 1, j)
        
        # Aplicação híbrida: se forem quadradas e dimensões >= 128 (conforme limiar do artigo)
        if A.shape[0] == A.shape[1] and B.shape[0] == B.shape[1] and A.shape[0] >= 128 and A.shape[0] % 2 == 0:
            return strassen_matrix_multiply(A, B)
        else:
            return np.dot(A, B)
            
    return multiply_recursive(0, n - 1)