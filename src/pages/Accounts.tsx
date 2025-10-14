import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Account } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Wallet, Edit, Trash2 } from "lucide-react";
import { AccountDialog } from "@/components/Accounts/AccountDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export default function Accounts() {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<{ accounts: Account[] }>("/account/list");
      if (response.data) {
        setAccounts(response.data.accounts);
      }
    } catch (error) {
      console.error("Error loading accounts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleCreateAccount = () => {
    setSelectedAccount(undefined);
    setDialogOpen(true);
  };

  const handleEditAccount = (account: Account, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedAccount(account);
    setDialogOpen(true);
  };

  const handleDeleteClick = (account: Account, e: React.MouseEvent) => {
    e.stopPropagation();
    setAccountToDelete(account);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!accountToDelete) return;

    try {
      await api.delete(`/account/delete/${accountToDelete.id}`);
      toast({
        title: "Sucesso",
        description: "Conta excluída com sucesso",
      });
      loadAccounts();
    } catch (error) {
      console.error("Error deleting account:", error);
    } finally {
      setDeleteDialogOpen(false);
      setAccountToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contas Bancárias</h1>
          <p className="text-muted-foreground">
            Gerencie suas contas bancárias
          </p>
        </div>
        <Button className="gap-2" onClick={handleCreateAccount}>
          <Plus className="w-4 h-4" />
          Nova Conta
        </Button>
      </div>

      {accounts.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Wallet className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">Nenhuma conta cadastrada</h3>
            <p className="text-muted-foreground text-center mb-6">
              Comece adicionando sua primeira conta bancária
            </p>
            <Button className="gap-2" onClick={handleCreateAccount}>
              <Plus className="w-4 h-4" />
              Adicionar Conta
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => (
            <Card
              key={account.id}
              className="shadow-card transition-base hover:shadow-md cursor-pointer"
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{account.name}</span>
                  {account.isActive ? (
                    <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                      Ativa
                    </span>
                  ) : (
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                      Inativa
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Banco</p>
                    <p className="font-medium">{account.bank?.name}</p>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Agência</p>
                      <p className="font-medium">{account.agency}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Conta</p>
                      <p className="font-medium">{account.accountNumber}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tipo</p>
                    <p className="font-medium">{account.accountType}</p>
                  </div>
                  <div className="pt-3 border-t">
                    <p className="text-sm text-muted-foreground mb-1">Saldo</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(account.balance)}
                    </p>
                  </div>
                  <div className="flex gap-2 pt-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={(e) => handleEditAccount(account, e)}
                    >
                      <Edit className="w-4 h-4" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 text-destructive hover:text-destructive"
                      onClick={(e) => handleDeleteClick(account, e)}
                    >
                      <Trash2 className="w-4 h-4" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AccountDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        account={selectedAccount}
        onSuccess={loadAccounts}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a conta "{accountToDelete?.name}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
