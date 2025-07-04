// lib/config.ts
export const appConfig = {
    name: "BitWise Agency",
    description: "Faça login para acessar sua plataforma",
    logoUrl: "/logo.svg", // Substitua pela URL do logo da plataforma

    defaultRedirect: {
        admin: "/admin",
        distribuidor: "/distribuidor",
        revendedor: "/revendedor",
    },

    supportEmail: "suporte@bitwise.com.br",
    showTestCredentials: true,
    enableMultiTenancy: false,

    // Textos customizados por tipo de usuário (opcional)
    roleLabels: {
        admin: "Administrador",
        distribuidor: "Distribuidor",
        revendedor: "Revendedor",
    },

    // Estilo (futuro):
    theme: {
        primaryColor: "#1e40af", // Azul padrão
        secondaryColor: "#f59e0b", // Laranja
    },
};
