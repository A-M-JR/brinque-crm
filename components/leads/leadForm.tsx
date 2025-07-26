"use client"

import React from 'react';
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogFooter } from "@/components/ui/dialog";
import { User, Mail, Phone, FileText, MapPin } from 'lucide-react';
import { Lead } from '@/lib/supabase/leads';

// --- Tipagens ---
export type LeadFormData = {
    name: string;
    email: string;
    phone?: string;
    cpf?: string;
    city?: string;
    state?: string;
};

type LeadFormProps = {
    mode: 'view' | 'create';
    lead?: Lead; // Obrigatório para o modo 'view'
    onSubmit?: (data: LeadFormData) => void | Promise<void>;
    onCancel?: () => void;
    loading?: boolean;
};

// --- Componente ---
export function LeadForm({ mode, lead, onSubmit, onCancel, loading = false }: LeadFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<LeadFormData>();

    // --- MODO DE VISUALIZAÇÃO ---
    if (mode === 'view' && lead) {
        const formatKey = (key: string) => key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

        const renderFormData = () => {
            if (!lead.form_data || Object.keys(lead.form_data).length === 0) {
                return <p className="text-sm text-muted-foreground">Nenhuma informação adicional foi fornecida.</p>;
            }
            return Object.entries(lead.form_data).map(([key, value]) => (
                <div key={key}>
                    <p className="font-semibold text-sm">{formatKey(key)}:</p>
                    <p className="text-sm text-muted-foreground">{String(value)}</p>
                </div>
            ));
        };

        return (
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4 py-4">
                <Card>
                    <CardHeader><CardTitle className="text-lg">Dados do Lead</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                        <div className="flex items-start gap-3"><User className="h-4 w-4 mt-1 text-muted-foreground" /><p><span className="font-semibold">Nome:</span> {lead.name}</p></div>
                        <div className="flex items-start gap-3"><Mail className="h-4 w-4 mt-1 text-muted-foreground" /><p><span className="font-semibold">Email:</span> {lead.email}</p></div>
                        <div className="flex items-start gap-3"><Phone className="h-4 w-4 mt-1 text-muted-foreground" /><p><span className="font-semibold">WhatsApp:</span> {lead.phone || 'N/A'}</p></div>
                        <div className="flex items-start gap-3"><FileText className="h-4 w-4 mt-1 text-muted-foreground" /><p><span className="font-semibold">CPF:</span> {lead.cpf || 'N/A'}</p></div>
                        <div className="flex items-start gap-3"><MapPin className="h-4 w-4 mt-1 text-muted-foreground" /><p><span className="font-semibold">Local:</span> {lead.city || 'N/A'} - {lead.state || 'N/A'}</p></div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle className="text-lg">Respostas do Formulário</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                        {renderFormData()}
                    </CardContent>
                </Card>
            </div>
        );
    }

    // --- MODO DE CRIAÇÃO ---
    if (mode === 'create' && onSubmit && onCancel) {
        return (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="name">Nome Completo *</Label>
                        <Input id="name" {...register("name", { required: "O nome é obrigatório" })} disabled={loading} />
                        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input id="email" type="email" {...register("email", { required: "O email é obrigatório" })} disabled={loading} />
                        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="phone">WhatsApp</Label>
                        <Input id="phone" {...register("phone")} disabled={loading} />
                    </div>
                    <div>
                        <Label htmlFor="cpf">CPF</Label>
                        <Input id="cpf" {...register("cpf")} disabled={loading} />
                    </div>
                    <div>
                        <Label htmlFor="city">Cidade</Label>
                        <Input id="city" {...register("city")} disabled={loading} />
                    </div>
                    <div>
                        <Label htmlFor="state">Estado (UF)</Label>
                        <Input id="state" {...register("state")} disabled={loading} />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? "Salvando..." : "Salvar Lead"}
                    </Button>
                </DialogFooter>
            </form>
        );
    }

    // Retorno padrão caso as props não correspondam a um modo válido
    return <div>Configuração inválida do formulário.</div>;
}

