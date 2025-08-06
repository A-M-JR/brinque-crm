import { supabase } from "./client";

// --- Tipagens ---

export type Order = {
    id: number;
    created: string;
    company_id: number;
    franchise_id: number;
    user_id: number | null;
    status: 'pendente' | 'processando' | 'enviado' | 'concluído' | 'cancelado';
    total_amount: number;
    crm_companies: {
        name: string;
    } | null;
};

export type OrderItem = {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    price_per_unit: number;
    crm_products?: {
        name: string;
    };
};

// --- Funções ---

export async function listarPedidosPorFranchise(franchiseId: number): Promise<Order[]> {
    const { data, error } = await supabase
        .from("crm_orders")
        .select("*, crm_companies(name)")
        .eq("franchise_id", franchiseId)
        .order("created", { ascending: false });

    if (error) {
        console.error("Erro ao listar pedidos:", error);
        throw error;
    }
    return data as Order[];
}

export async function buscarPedidoPorId(orderId: number): Promise<{ order: Order | null; items: OrderItem[] }> {
    const { data: orderData, error: orderError } = await supabase
        .from("crm_orders")
        .select("*, crm_companies(name)")
        .eq("id", orderId)
        .single();

    if (orderError) throw orderError;

    const { data: itemsData, error: itemsError } = await supabase
        .from("crm_order_items")
        .select("*, crm_products(name)")
        .eq("order_id", orderId);

    if (itemsError) throw itemsError;

    return { order: orderData as Order, items: itemsData as OrderItem[] };
}

export async function criarPedido(
    orderData: Omit<Order, 'id' | 'created' | 'crm_companies'>,
    itemsData: Omit<OrderItem, 'id' | 'order_id'>[]
): Promise<Order> {
    const { data: newOrder, error: orderError } = await supabase
        .from("crm_orders")
        .insert([orderData])
        .select()
        .single();

    if (orderError) {
        console.error("Erro ao criar o registo principal do pedido:", orderError);
        throw new Error(`Falha ao criar pedido: ${orderError.message}`);
    }

    const itemsToInsert = itemsData.map(item => ({
        ...item,
        order_id: newOrder.id,
    }));

    // Log para depuração
    console.log("Tentando inserir os seguintes itens:", JSON.stringify(itemsToInsert, null, 2));

    const { error: itemsError } = await supabase
        .from("crm_order_items")
        .insert(itemsToInsert);

    if (itemsError) {
        console.error("Erro detalhado ao inserir itens do pedido:", JSON.stringify(itemsError, null, 2));
        // Se a inserção dos itens falhar, deleta o pedido criado para evitar dados órfãos.
        await supabase.from("crm_orders").delete().eq("id", newOrder.id);
        throw new Error(`Falha ao inserir itens do pedido: ${itemsError.message}`);
    }

    return newOrder as Order;
}
