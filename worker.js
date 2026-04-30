export default {
  async fetch(request) {
    return new Response(JSON.stringify({
      ok: true,
      races: [
        {
          id: "tokyo_11R",
          name: "サンプルレース",
          place: "東京",
          raceNo: "11R",
          grade: "G2"
        }
      ]
    }), {
      headers: { "content-type": "application/json" }
    });
  }
};
