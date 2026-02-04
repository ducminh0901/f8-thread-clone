import httpRequest from "@/utils/httpRequests";

const baseQuery = async (args) => {
    const isObj = typeof args === "object";

    const config = {
        url: isObj ? args.url : args,
        method: isObj && args.method ? args.method : "GET",
    };

    if (isObj) {
        if (args.body) config.data = args.body;
        if (args.params) config.params = args.params;
        if (args.headers) config.headers = args.headers;
    }

    try {
        const response = await httpRequest(config);
        return { data: response };
    } catch (error) {
        return {
            error: {
                status: error.response?.status,
                data: error.response?.data || error.message,
            },
        };
    }
};

export default baseQuery;
