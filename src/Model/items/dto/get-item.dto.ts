
export class itemDTO {
    id: number;
    name: string;
    thumbnail: string;
    image: string;
}
export class PageItemDTO {
    totalItems: number;
    pageLength: number;
    currentPage: number;
    pageSize: number;
}
export class PaginatedCategoriesDTO {
    data: itemDTO[];
    pagination: PageItemDTO;
}