import axiosClient from "./axiosClient";
const itemApi = {
  //category
  delete_Category(data) {
    const url = `/category/${data}`;
    return axiosClient.delete(url);
  },
  create_Category(data) {
    const url = `/category`;
    return axiosClient.post(url,data);
  },
  update_Category(data) {
    const{id,...rest} = data
    const url = `/category/${id}`;
    return axiosClient.put(url,rest);
  },
  GetAllCategory(page){
    const url = `/category?page=${page}`;
    return axiosClient.get(url);
  },
  GetCategoryById(id){
    const url = `/category/${id}`;
    return axiosClient.get(url);
  },
  //Item
  search(query,page) {
    const url = `/item/search?q=${query}&page=${page}`;
    return axiosClient.get(url);
  },
  GetItemByCategoryId(id){
    const url = `/item/category/${id}`;
    return axiosClient.get(url);
  },
  home(page){
    const url = `/item?page=${page}`;
    return axiosClient.get(url);
  },
  get_items(id){
    const url = `/item/${id}`;
    return axiosClient.get(url);
  },
  delete_Items(data) {
    const url = `/item/${data}`;
    return axiosClient.delete(url);
  },
  create_Items(data) {
    const url = `/item`;
    return axiosClient.post(url,data);
  },
  update_Items(data) {
    const{id,...rest} = data
    const url = `/item/${id}`;
    return axiosClient.put(url,rest);
  }
};

export default itemApi;