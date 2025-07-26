import { useState, useEffect } from "react";
import { GrupoPermissao } from "@/lib/supabase/permissoes";
import { supabase } from "@/lib/supabase/client";

export function usePermissionGroups() {
    const [groups, setGroups] = useState<GrupoPermissao[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("crm_permission_groups")
                .select("*");

            if (error) setError(error.message);
            else setGroups(data as GrupoPermissao[]);

            setLoading(false);
        };

        fetch();
    }, []);

    return { groups, loading, error };
}
