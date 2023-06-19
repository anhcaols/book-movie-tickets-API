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

  async isWeekend(dateString) {
    const date = new Date(dateString);
    const day = date.getDay();
    return day === 6 || day === 0;
  }
}

export const utils = new Utils();
