// src/stores/envelopes.js
import { defineStore } from "pinia";
import api from "@/services/api";

// Local Mock DB fallback to allow immediate testing before backend is ready
let mockIdCounter = 1;
let localMockDB = [];

export const useEnvelopeStore = defineStore("envelopes", {
  state: () => ({
    envelopes: [],
    isLoading: false,
  }),
  getters: {
    processedEnvelopes: (state) => {
      const today = new Date().toISOString().split("T")[0];
      return state.envelopes.map((env) => {
        let status = "upcoming";
        if (today >= env.start_date && today <= env.end_date) status = "active";
        else if (today > env.end_date) status = "ended";

        return { ...env, status };
      });
    },
    activeEnvelopes: (state) => {
      return state.processedEnvelopes.filter((e) => e.status === "active");
    },
    totalReserved: (state) => {
      return state.activeEnvelopes.reduce(
        (sum, e) => sum + parseFloat(e.amount),
        0,
      );
    },
  },
  actions: {
    async fetchEnvelopes() {
      this.isLoading = true;
      try {
        const res = await api.get("/envelopes/");
        this.envelopes = res.data;
      } catch (error) {
        console.warn(
          "API Stub: /envelopes/ GET not available. Using mock data.",
        );
        this.envelopes = [...localMockDB];
      } finally {
        this.isLoading = false;
      }
    },
    async addEnvelope(envelopeData) {
      try {
        const res = await api.post("/envelopes/", envelopeData);
        await this.fetchEnvelopes();
        return res.data;
      } catch (error) {
        console.warn(
          "API Stub: /envelopes/ POST not available. Saving locally.",
        );
        const newEnv = { ...envelopeData, id: mockIdCounter++ };
        localMockDB.push(newEnv);
        await this.fetchEnvelopes();
        return newEnv;
      }
    },
    async updateEnvelope(id, envelopeData) {
      try {
        const res = await api.put(`/envelopes/${id}/`, envelopeData);
        await this.fetchEnvelopes();
        return res.data;
      } catch (error) {
        console.warn(
          `API Stub: /envelopes/${id}/ PUT not available. Updating locally.`,
        );
        const index = localMockDB.findIndex((e) => e.id === id);
        if (index !== -1) localMockDB[index] = { ...envelopeData, id };
        await this.fetchEnvelopes();
      }
    },
    async deleteEnvelope(id) {
      try {
        await api.delete(`/envelopes/${id}/`);
        await this.fetchEnvelopes();
      } catch (error) {
        console.warn(
          `API Stub: /envelopes/${id}/ DELETE not available. Deleting locally.`,
        );
        localMockDB = localMockDB.filter((e) => e.id !== id);
        await this.fetchEnvelopes();
      }
    },
  },
});
