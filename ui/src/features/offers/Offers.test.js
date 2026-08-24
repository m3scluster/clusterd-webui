import { flattenOffers } from "./Offers";

describe("flattenOffers", () => {
  test("flattens framework offers and enriches framework and agent metadata", () => {
    const offer = {
      id: "offer-1",
      slave_id: "agent-1",
      allocation_info: { role: "batch" },
      resources: { cpus: 2 },
    };

    expect(flattenOffers({
      frameworks: [{ id: "framework-1", name: "Synthetic framework", offers: [offer] }],
      slaves: [{ id: "agent-1", hostname: "agent.example" }],
    })).toEqual([{
      ...offer,
      framework_id: "framework-1",
      framework_name: "Synthetic framework",
      hostname: "agent.example",
    }]);
  });

  test("returns an empty collection for missing collections and preserves missing metadata safely", () => {
    expect(flattenOffers(null)).toEqual([]);
    expect(flattenOffers({ frameworks: [{ id: "framework-1", offers: [{}] }] })).toEqual([{
      framework_id: "framework-1",
      framework_name: "—",
      hostname: "—",
    }]);
  });
});
