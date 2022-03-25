export const HOST = 'http://localhost:8080/';
export const USER_API_CONST = (
    page?: number,
    pageSize?: number,
    id?: number,
    keyword?: string
) => {
    const pageSizeParam = pageSize !== undefined ? `&pageSize=${pageSize}` : '';
    const pageParam = page !== undefined ? `page=${page}` : '';
    const keywordParam = keyword !== undefined ? `search=${keyword}` : '';
    return {
        GET: `${HOST}recipes?${keywordParam}${pageParam}${pageSizeParam}`,
        GET_BY_ID: `${HOST}recipes/${id}`,
        POST: `${HOST}recipes`,
        PUT: `${HOST}recipes/${id}`,
        DELETE: `${HOST}recipes/${id}`,
    };
};

export const ELEMENT_TXT = {
    DELETE_BUTTON: 'DELETE',
    INPUT_PLACEHOLDER: 'Please typing your keyword ...',
};
