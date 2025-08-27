import { supabase } from './client';

/**
 * Faz o upload de um arquivo de imagem para o bucket de produtos.
 * @param file O arquivo a ser enviado (do input type="file").
 * @param franchiseId O ID da franquia para organizar os arquivos.
 * @returns A URL pública da imagem enviada.
 */
export async function uploadProductImage(file: File, franchiseId: number): Promise<string> {
    if (!file) {
        throw new Error("Nenhum arquivo fornecido para upload.");
    }

    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExtension}`;
    const filePath = `${franchiseId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('product_images')
        .upload(filePath, file);

    if (uploadError) {
        console.error("Erro no upload da imagem:", uploadError);
        throw uploadError;
    }

    const { data } = supabase.storage
        .from('product_images')
        .getPublicUrl(filePath);

    if (!data.publicUrl) {
        throw new Error("Não foi possível obter a URL pública da imagem.");
    }

    return data.publicUrl;
}