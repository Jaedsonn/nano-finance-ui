import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { api } from "@/lib/api";
import { Account, Bank, AccountType } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface AccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account?: Account;
  onSuccess: () => void;
}

const accountTypes: AccountType[] = [
  "Checking Account",
  "Savings Account",
  "Business Account",
  "Join Account",
  "Student Account",
  "Investment Account",
];

export function AccountDialog({ open, onOpenChange, account, onSuccess }: AccountDialogProps) {
  const { toast } = useToast();
  const [banks, setBanks] = useState<Bank[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    accountNumber: "",
    agency: "",
    balance: "0",
    isActive: true,
    accountType: "Checking Account" as AccountType,
    bankId: "",
  });

  useEffect(() => {
    if (open) {
      loadBanks();
      if (account) {
        setFormData({
          name: account.name,
          accountNumber: account.accountNumber,
          agency: account.agency,
          balance: account.balance.toString(),
          isActive: account.isActive,
          accountType: account.accountType,
          bankId: account.bank?.id || "",
        });
      } else {
        setFormData({
          name: "",
          accountNumber: "",
          agency: "",
          balance: "0",
          isActive: true,
          accountType: "Checking Account",
          bankId: "",
        });
      }
    }
  }, [open, account]);

  const loadBanks = async () => {
    try {
      const response = await api.get<{ banks: Bank[] }>("/bank/all");
      if (response.data) {
        setBanks(response.data.banks);
      }
    } catch (error) {
      console.error("Error loading banks:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        balance: parseFloat(formData.balance),
      };

      if (account) {
        await api.put(`/account/update/${account.id}`, payload);
        toast({
          title: "Sucesso",
          description: "Conta atualizada com sucesso",
        });
      } else {
        await api.post("/account/create", payload);
        toast({
          title: "Sucesso",
          description: "Conta criada com sucesso",
        });
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving account:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{account ? "Editar Conta" : "Nova Conta"}</DialogTitle>
          <DialogDescription>
            {account ? "Atualize as informações da conta" : "Cadastre uma nova conta bancária"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Conta</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="agency">Agência</Label>
              <Input
                id="agency"
                value={formData.agency}
                onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Número da Conta</Label>
              <Input
                id="accountNumber"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bankId">Banco</Label>
            <Select value={formData.bankId} onValueChange={(value) => setFormData({ ...formData, bankId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um banco" />
              </SelectTrigger>
              <SelectContent>
                {banks.map((bank) => (
                  <SelectItem key={bank.id} value={bank.id}>
                    {bank.name} - {bank.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountType">Tipo de Conta</Label>
            <Select value={formData.accountType} onValueChange={(value) => setFormData({ ...formData, accountType: value as AccountType })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {accountTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="balance">Saldo Inicial</Label>
            <Input
              id="balance"
              type="number"
              step="0.01"
              value={formData.balance}
              onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
            <Label htmlFor="isActive">Conta Ativa</Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : account ? "Atualizar" : "Criar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
