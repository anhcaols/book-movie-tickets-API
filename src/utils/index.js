export class Utils {
  async pagination(req, totalDocs) {
    const limit = parseInt(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const offset = (page - 1) * limit;
    const totalPages = Math.ceil(totalDocs / limit);
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;

    return {
      limit,
      page,
      offset,
      totalPages,
      hasNextPage,
      hasPrevPage,
    };
  }
}

export const utils = new Utils();
