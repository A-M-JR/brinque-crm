"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from 'lucide-react';
import { Company } from '@/lib/supabase/companies';
import { Product } from '@/lib/supabase/products';
import { Order, OrderItem } from '@/lib/supabase/orders';

// --- Tipagens ---
export type OrderFormData = {
  company_id: number;
  user_id: number | null;
  status: Order['status'];
  total_amount: number;
  shipping_cost: number;
  notes: string;
  items: {
    product_id: number;
    quantity: number;
    price_per_unit: number;
  }[];
};

type OrderFormProps = {
  mode: 'create' | 'view';
  order?: { order: Order; items: OrderItem[] }; // Para modo 'view'
  customers: Pick<Company, 'id' | 'name'>[]; // Lista de clientes para o select
  products: Pick<Product, 'id' | 'name' | 'price'>[]; // Lista de produtos para o select
  userId: number | null;
  onSubmit?: (data: OrderFormData) => void | Promise<void>;
  onStatusChange?: (newStatus: Order['status']) => void;
  loading?: boolean;
};

export function OrderForm({ mode, order, customers, products, userId, onSubmit, onStatusChange, loading = false }: OrderFormProps) {

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<OrderFormData>({
    defaultValues: {
      items: [{ product_id: 0, quantity: 1, price_per_unit: 0 }]
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const watchedItems = watch("items");

  // Calcula o total do pedido dinamicamente
  const total = useMemo(() => {
    return watchedItems.reduce((acc, item) => acc + (item.price_per_unit || 0) * (item.quantity || 0), 0);
  }, [watchedItems]);

  useEffect(() => {
    setValue("total_amount", total);
  }, [total, setValue]);

  // --- MODO DE VISUALIZAÇÃO ---
  if (mode === 'view' && order) {
    const getStatusVariant = (status: Order['status']) => {
      switch (status) {
        case 'concluído': return 'default';
        case 'cancelado': return 'destructive';
        default: return 'secondary';
      }
    };

    return (
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-4 py-4">
        <Card>
          <CardHeader><CardTitle>Detalhes do Pedido #{order.order.id}</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-sm">
            <div><strong>Cliente:</strong> {order.order.crm_companies?.name}</div>
            <div><strong>Data:</strong> {new Date(order.order.created).toLocaleDateString()}</div>
            <div><strong>Status:</strong> <Badge variant={getStatusVariant(order.order.status)}>{order.order.status}</Badge></div>
            <div><strong>Valor Total:</strong> R$ {order.order.total_amount.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Itens do Pedido</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Produto</TableHead><TableHead>Qtd.</TableHead><TableHead>Preço Unit.</TableHead><TableHead>Subtotal</TableHead></TableRow></TableHeader>
              <TableBody>
                {order.items.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.crm_products?.name || 'Produto não encontrado'}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>R$ {item.price_per_unit.toFixed(2)}</TableCell>
                    <TableCell>R$ {(item.quantity * item.price_per_unit).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- MODO DE CRIAÇÃO ---
  if (mode === 'create' && onSubmit) {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardHeader><CardTitle>Cliente</CardTitle></CardHeader>
          <CardContent>
            <Controller
              name="company_id"
              control={control}
              rules={{ required: "Selecione um cliente" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                  <SelectTrigger><SelectValue placeholder="Selecione um cliente..." /></SelectTrigger>
                  <SelectContent>{customers.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              )}
            />
            {errors.company_id && <p className="text-sm text-red-500 mt-1">{errors.company_id.message}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Itens do Pedido</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-2">
                <div className="flex-1">
                  <Label>Produto</Label>
                  <Controller
                    name={`items.${index}.product_id`}
                    control={control}
                    rules={{ validate: value => value > 0 || "Selecione um produto" }}
                    render={({ field: controllerField }) => (
                      <Select onValueChange={(value) => {
                        controllerField.onChange(Number(value));
                        const product = products.find(p => p.id === Number(value));
                        setValue(`items.${index}.price_per_unit`, product?.price || 0);
                      }} defaultValue={controllerField.value?.toString()}>
                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        <SelectContent>{products.map(p => <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>)}</SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="w-24">
                  <Label>Qtd.</Label>
                  <Input type="number" {...register(`items.${index}.quantity`, { valueAsNumber: true, min: 1 })} defaultValue={1} />
                </div>
                <div className="w-32">
                  <Label>Preço Unit.</Label>
                  <Input type="number" step="0.01" {...register(`items.${index}.price_per_unit`, { valueAsNumber: true })} />
                </div>
                <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} disabled={fields.length <= 1}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => append({ product_id: 0, quantity: 1, price_per_unit: 0 })}><Plus className="h-4 w-4 mr-2" />Adicionar Item</Button>
          </CardContent>
        </Card>

        <div className="text-right font-bold text-lg">Total: R$ {total.toFixed(2)}</div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>{loading ? "Criando..." : "Criar Pedido"}</Button>
        </div>
      </form>
    );
  }

  return null;
}
