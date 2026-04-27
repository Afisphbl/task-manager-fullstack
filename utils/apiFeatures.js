class Features {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    // 1) Filtering
    const excludedQuery = ["page", "sort", "fields", "limit"];
    const allowedFields = ["title", "description", "completed", "createdAt"];

    const sanitize = (val) => {
      if (val === null || typeof val !== "object") return val;
      const out = Array.isArray(val) ? [] : {};
      for (const [k, v] of Object.entries(val)) {
        if (k.startsWith("$")) continue; // drop Mongo operators
        out[k] = sanitize(v);
      }
      return out;
    };

    const queryObj = {};
    for (const [k, v] of Object.entries(this.queryStr)) {
      if (excludedQuery.includes(k)) continue;
      if (!allowedFields.includes(k)) continue; // whitelist filter fields
      queryObj[k] = sanitize(v);
    }

    this.query = this.query.find(queryObj);

    return this;
  }

  sort() {
    if (typeof this.queryStr.sort === "string") {
      const sortBy = this.queryStr.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    if (typeof this.queryStr.fields === "string") {
      const fields = this.queryStr.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  pagination() {
    const MAX_LIMIT = 100;
    const page = Math.max(1, Number.parseInt(this.queryStr.page, 10) || 1);
    const rawLimit = Number.parseInt(this.queryStr.limit, 10) || 10;
    const limit = Math.min(Math.max(1, rawLimit), MAX_LIMIT);
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = Features;
