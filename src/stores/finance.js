// src/stores/finance.js
import { defineStore } from "pinia";
import api from "@/services/api";

export const useFinanceStore = defineStore("finance", {
  state: () => ({
    balance: 0,
    incomes: [],
    transactions: [],
    isLoading: false,
  }),
  actions: {
    // <-- DÉBUT DES ACTIONS
    async fetchFinanceData() {
      this.isLoading = true;
      try {
        const userRes = await api.get("/users/me/");
        this.balance = parseFloat(userRes.data.current_balance) || 0;

        // Fetch incomes
        const incomeRes = await api.get("/incomes/");
        this.incomes = incomeRes.data;

        // Fetch recent transactions
        const transRes = await api.get("/transactions/");
        this.transactions = transRes.data;
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données financières",
          error,
        );
      } finally {
        this.isLoading = false;
      }
    },
    async addTransaction(transactionData) {
      try {
        const response = await api.post("/transactions/", transactionData);
        await this.fetchFinanceData(); // Rafraîchit instantanément le solde
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async addIncome(incomeData) {
      try {
        const response = await api.post("/incomes/", incomeData);
        await this.fetchFinanceData();
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async updateIncome(id, incomeData) {
      try {
        const response = await api.put(`/incomes/${id}/`, incomeData);

        await this.fetchFinanceData();
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async deleteIncome(id) {
      try {
        await api.delete(`/incomes/${id}/`);
        await this.fetchFinanceData(); // on synchronise tout au mm temps
      } catch (error) {
        throw error;
      }
    },
  },
});
