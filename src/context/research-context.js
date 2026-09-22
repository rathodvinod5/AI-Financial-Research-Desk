export const createResearchContext = (researchId, userId, company) => ({
  researchId,
  userId,
  company,

  logger: {
    info: (message) => console.log(`[INFO] ${message}`),
    error: (message) => console.log(`[ERROR] ${message}`),
  },
});
