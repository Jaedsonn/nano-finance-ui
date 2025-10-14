import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { Transaction, Account, TransactionType, TransactionCategory } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction;
  onSuccess: () => void;
}

const transactionTypes: TransactionType[] = [
  "Deposit",
  "Withdrawal",
  "Transfer",
  "Payment",
  "Refund",
  "Fee",
  "Interest",
  "Adjustment",
];

const transactionCategories: TransactionCategory[] = [
  "Groceries",
  "Utilities",
  "Rent",
  "Entertainment",
  "Transportation",
  "Healthcare",
  "Education",
  "Other",
];

export function TransactionDialog({ open, onOpenChange, transaction, onSuccess }: TransactionDialogProps) {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    accountId: "",
    amount: "",
    type: "Deposit" as TransactionType,
    description: "",
    from: "",
    to: "",
    category: "Other" as TransactionCategory,
  });

  useEffect(() => {
    if (open) {
      loadAccounts();
      if (transaction) {
        setFormData({
          accountId: transaction.account?.id || "",
          amount: transaction.amount.toString(),
          type: transaction.type,
          description: transaction.description,
          from: transaction.from,
          to: transaction.to,
          category: transaction.category,
        });
      } else {
        setFormData({
          accountId: "",
          amount: "",
          type: "Deposit",
          description: "",
          from: "",
          to: "",
          category: "Other",
        });
      }
    }
  }, [open, transaction]);

  const loadAccounts = async () => {
    try {
      const response = await api.get<{ accounts: Account[] }>("/account/list");
      if (response.data) {
        setAccounts(response.data.accounts);
      }
    } catch (error) {
      console.error("Error loading accounts:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
      };

      if (transaction) {
        await api.put(`/transaction/${transaction.id}/update`, payload);
        toast({
          title: "Sucesso",
          description: "Transação atualizada com sucesso",
        });
      } else {
        await api.post("/transaction/create", payload);
        toast({
          title: "Sucesso",
          description: "Transação criada com sucesso",
        });
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving transaction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{transaction ? "Editar Transação" : "Nova Transação"}</DialogTitle>
          <DialogDescription>
            {transaction ? "Atualize as informações da transação" : "Registre uma nova transação"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="accountId">Conta</Label>
            <Select value={formData.accountId} onValueChange={(value) => setFormData({ ...formData, accountId: value })} disabled={!!transaction}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma conta" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name} - {account.accountNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as TransactionType })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {transactionTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value as TransactionCategory })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {transactionCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from">De</Label>
              <Input
                id="from"
                value={formData.from}
                onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="to">Para</Label>
              <Input
                id="to"
                value={formData.to}
                onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : transaction ? "Atualizar" : "Criar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
