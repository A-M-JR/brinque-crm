import { supabase } from "./client";

// --- Tipagens ---

import { Category } from "./categories"; // Importar a tipagem

// --- Tipagens ---

export type Product = {
    id: number;
    created: string;
    name: string;
    sku: string | null;
    description: string | null;
    price: number;
    old_price: number | null;
    is_new: boolean;
    status: boolean;
    show_on_store: boolean;
    images: any | null;
    custom_fields: any | null;
    franchise_id: number;
    category_id: number | null; // <-- NOVO CAMPO
    inventory?: {
        quantity: number;
        min_stock_level: number;
    };
    // Campo virtual para trazer os dados da categoria
    category?: Pick<Category, 'id' | 'name'>;
};

export type Inventory = {
    id: number;
    product_id: number;
    quantity: number;
    min_stock_level: number;
};

export type StockMovement = {
    id: number;
    created: string;
    product_id: number;
    quantity_change: number;
    reason: string;
    related_order_id: string | null;
};


// --- Funções para Produtos (crm_products) ---

export async function listarProdutosPorFranchise(franchiseId: number): Promise<Product[]> {
    const { data, error } = await supabase
        .from("crm_products")
        // ATUALIZADO: Trazendo dados da categoria junto
        .select("*, inventory:crm_inventory(quantity, min_stock_level), category:crm_categories(id, name)")
        .eq("franchise_id", franchiseId)
        .order("name");

    if (error) throw error;
    // Mapeamento para ajustar a estrutura do inventory
    return data.map(p => ({ ...p, inventory: p.inventory[0] })) as Product[];
}

export async function buscarProdutoPorId(id: number): Promise<Product | null> {
    const { data, error } = await supabase
        .from("crm_products")
        // ATUALIZADO: Trazendo dados da categoria junto
        .select("*, inventory:crm_inventory(quantity, min_stock_level), category:crm_categories(id, name)")
        .eq("id", id)
        .single();

    if (error) throw error;
    const inventoryData = Array.isArray(data.inventory) ? data.inventory[0] : data.inventory;
    return { ...data, inventory: inventoryData } as Product;
}

// ATUALIZADO: criarProduto agora aceita category_id
export async function criarProduto(productData: Omit<Product, 'id' | 'created' | 'inventory' | 'category'>): Promise<Product> {
    const { data: newProduct, error: productError } = await supabase
        .from("crm_products")
        .insert([productData])
        .select()
        .single();

    if (productError) throw productError;

    // Lógica de inventário permanece a mesma
    const { error: inventoryError } = await supabase
        .from("crm_inventory")
        .insert([{ product_id: newProduct.id, quantity: 0, min_stock_level: 0 }]);

    if (inventoryError) {
        await supabase.from("crm_products").delete().eq("id", newProduct.id);
        throw inventoryError;
    }

    return newProduct as Product;
}

// ATUALIZADO: atualizarProduto agora aceita category_id
export async function atualizarProduto(id: number, updates: Partial<Omit<Product, 'id' | 'created' | 'inventory' | 'category'>>): Promise<Product> {
    const { data, error } = await supabase
        .from("crm_products")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data as Product;
}
// --- Funções para Inventário e Movimentações ---

export async function atualizarInventario(productId: number, updates: Partial<Omit<Inventory, 'id' | 'product_id'>>): Promise<Inventory> {
    const { data, error } = await supabase
        .from("crm_inventory")
        .update(updates)
        .eq("product_id", productId)
        .select()
        .single();

    if (error) throw error;
    return data as Inventory;
}

/**
 * Adiciona uma movimentação de estoque e atualiza a quantidade total.
 */
export async function adicionarMovimentacaoEstoque(productId: number, quantityChange: number, reason: string) {
    // Passo 1: Regista a movimentação
    const { error: movementError } = await supabase
        .from("crm_stock_movements")
        .insert([{ product_id: productId, quantity_change: quantityChange, reason }]);

    if (movementError) {
        console.error("Erro ao registar movimentação de estoque:", movementError);
        throw movementError;
    }

    // Passo 2: Busca o estoque atual
    const { data: currentInventory, error: fetchError } = await supabase
        .from('crm_inventory')
        .select('quantity')
        .eq('product_id', productId)
        .single();

    if (fetchError) {
        console.error("Erro ao buscar estoque atual:", fetchError);
        throw fetchError;
    }

    // Passo 3: Calcula e atualiza a nova quantidade
    const newQuantity = (currentInventory?.quantity || 0) + quantityChange;
    const { error: updateError } = await supabase
        .from('crm_inventory')
        .update({ quantity: newQuantity })
        .eq('product_id', productId);

    if (updateError) {
        console.error("Erro ao atualizar a quantidade em estoque:", updateError);
        throw updateError;
    }
}

export async function listarMovimentacoesDeEstoque(productId: number): Promise<StockMovement[]> {
    const { data, error } = await supabase
        .from("crm_stock_movements")
        .select("*")
        .eq("product_id", productId)
        .order("created", { ascending: false });

    if (error) throw error;
    return data as StockMovement[];
}
