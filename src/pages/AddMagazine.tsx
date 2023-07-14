import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import InputR from "../components/InputR";
import ButtonR from "../components/ButtonR";
import Select from "react-select";
import up_g from "../images/up_g.png";
import down_g from "../images/down_g.png";
import up_b from "../images/up_b.png";
import down_b from "../images/down_b.png";
import sample from "../images/sample_img.png";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock";
import { currency, moveValue } from "../common/utils";
import { getDatas, postAddProduct, postUploadImage } from "../common/apis";
import { useNavigate } from "react-router-dom";
import SelectBox from "../components/SelectBox";

interface IPoint {
  summary: string;
  desc: string;
  imgUrls: IFile[];
}

interface IProductInfo {
  title: string;
  content: string;
}

interface IFile {
  file: File | null;
  imgUrl: string;
}

export default function AddMagazine(): JSX.Element {
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [txtLength, setTxtLength] = useState(0);

  const [dates, setDates] = useState<{
    openingDate: string;
  }>({
    openingDate: "",
  });

  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);

  const [openStatus, setOpenStatus] = useState<boolean>(true);

  const inputFileRef = useRef<any[]>([]);
  const [files, setFiles] = useState<any>({
    thumbnail: [],
    detailImg: [],
  });
  const [contents, setContents] = useState<any[]>([]);
  const [contentForm, setContentForm] = useState<any>({
    title: "",
    detail: "",
    images: [],
  });

  // 연관상품
  const [relatedProducts, setRelatedProducts] = useState<any>({
    type: "random",
    products: [],
  });

  // 카테고리
  const [categories, setCategories] = useState<any>([]);
  // 서브카테고리
  const [subCategories, setSubCategories] = useState<any>([]);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const targetIdx = categories.findIndex((el: any, i: number) => el === selectedCategory);

      let tempCategories = [];
      for (let i = 0; i < categories[targetIdx].subCategories?.length; i++) {
        tempCategories.push({
          value: categories[targetIdx].subCategories[i].optionName,
          label: categories[targetIdx].subCategories[i].optionName,
          categoryId: categories[targetIdx]._id,
        });
      }

      setSubCategories(tempCategories);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedSubCategory) {
      selectedProducts();
    }
  }, [selectedSubCategory]);

  const init = async () => {
    // 카테고리 불러오기
    const getCategories: any = await getDatas({
      collection: "categories",
    });

    let tempcategories = [];
    for (let i = 0; i < getCategories?.data?.length; i++) {
      tempcategories.push({
        value: getCategories?.data[i]?.name,
        label: getCategories?.data[i]?.name,
        subCategories: getCategories?.data[i]?.subCategories,
        _id: getCategories?.data[i]?._id,
      });
    }

    setCategories(tempcategories);
  };

  const selectedProducts = async () => {
    const find = {
      categoryId: selectedSubCategory.categoryId,
      category2: selectedSubCategory.value,
    };

    const selectProducts: any = await getDatas({
      collection: "products",
      find: find,
    });

    const { data } = selectProducts;

    let tempProductSelect: any = [];
    for (let i = 0; i < data?.length; i++) {
      tempProductSelect.push({
        value: data[i].productNameK,
        label: data[i].productNameK,
        ...data[i],
      });
    }

    setProducts(tempProductSelect);
  };

  // useEffect(() => {
  //   console.log(productOptions);
  //   console.log(form);
  // }, [productOptions, form]);

  const handleUploadClick = async (idx: number) => {
    inputFileRef?.current[idx]?.click();
  };

  // 이미지 첨부 핸들러
  const handleFileChange = (evt: any, type: string) => {
    const file = evt.target.files?.[0];
    const imgUrl = URL.createObjectURL(file);
    if (type === "thumbnail") {
      setFiles((prev: any) => {
        return {
          ...prev,
          [type]: [
            {
              file: file,
              fileUrl: URL.createObjectURL(file),
            },
          ],
        };
      });
    } else {
      setFiles((prev: any) => {
        return {
          ...prev,
          [type]: [
            ...prev[type],
            {
              file: file,
              fileUrl: URL.createObjectURL(file),
            },
          ],
        };
      });
    }
  };

  const handleFileChange2 = (evt: any, type: string) => {
    const file = evt.target.files?.[0];
    const imgUrl: any = URL.createObjectURL(file);
    let imgArr = [...contentForm.images];
    imgArr.push({
      file: file,
      imgUrl: imgUrl,
    });

    if (type === "details") {
      setContentForm((prev: any) => {
        return {
          ...prev,
          images: imgArr,
        };
      });
    }
  };

  const handleDeleteFile = (type: string, url: string) => {
    const filesArr = files[type];
    let tempFileArr: any = [];
    for (let i = 0; i < filesArr.length; i++) {
      if (filesArr[i].fileUrl !== url) {
        tempFileArr.push(filesArr[i]);
      }
    }
    setFiles((prev: any) => {
      return {
        ...prev,
        [type]: [...tempFileArr],
      };
    });
  };

  const handleAddForm = (type: string) => {
    let tempArr = [];

    switch (type) {
      case "details":
        tempArr = [...contents];
        tempArr.push(contentForm);
        setContents(tempArr);
        setContentForm({
          title: "",
          detail: "",
          images: [],
        });
        break;
    }
  };

  // 상품등록 모달창

  const handleChangeTextarea = (content: string) => {
    let str = content;
    str = str.replace(/(?:\r\n|\r|\n)/g, `<br/>`);
    return str;
  };

  const handleMoveOrder = (type: string, array: object[], fromIndex: number, toIndex: number) => {
    const newArr: any = moveValue(array, fromIndex, toIndex);

    if (type === "details") {
      setContents([...newArr]);
    }
  };

  const handleDeleteListItem = (type: string, i: number) => {
    let tempArr = [];

    switch (type) {
      case "details":
        tempArr = [...contents];
        tempArr.splice(i, 1);
        setContents(tempArr);
        break;
    }
  };

  const handleAddProduct = async () => {
    if (loading) return alert("데이터 처리중입니다.");
    setLoading(true);

    const startingDate = new Date(dates.openingDate);
    const timeStamp = startingDate.getTime();

    let tempRelatedProds = [];

    for (let i in relatedProducts.products) {
      tempRelatedProds.push({
        _id: relatedProducts.products[i]._id,
        thumbnail: relatedProducts.products[i].thumbnail,
        productNameK: relatedProducts.products[i].productNameK,
        price: relatedProducts.products[i].price,
        discounted: relatedProducts.products[i].discounted,
      });
    }

    let _body: any = {
      title,
      contents,
      openingStamp: timeStamp,
      relatedProd: tempRelatedProds,
      openStatus,
    };

    // 대표이미지(썸네일)
    const formData = new FormData();
    formData.append("file", files.thumbnail[0]?.file);
    const getUrl: any = await postUploadImage(formData);
    _body.thumbnail = getUrl.url;

    // // 추가이미지
    const formData2 = new FormData();
    formData2.append("file", files.detailImg[0]?.file);
    const getUrl2: any = await postUploadImage(formData2);
    _body.detailImg = getUrl2.url;

    // 구매포인트
    let tempContents: any = [...contents];

    for (let i = 0; i < tempContents?.length; i++) {
      let tempImgArr: string[] = [];
      for (let k = 0; k < tempContents[i]?.images?.length; k++) {
        const formData = new FormData();
        formData.append("file", tempContents[i]?.images[k]?.file);
        const getUrl: any = await postUploadImage(formData);
        if (getUrl.result) {
          tempImgArr.push(getUrl.url);
        }
      }

      tempContents[i].images = tempImgArr;
    }
    _body.contents = tempContents;

    const productAddResult: any = await postAddProduct({
      collection: "magazines",
      ..._body,
    });

    if (productAddResult.result) {
      alert("매거진 등록이 완료되었습니다.");
      navigate(-1);
    }
    setLoading(false);
  };

  const onChangeHandler = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setDesc(e.target.value);
    setTxtLength(e.target.value.length);
  }, []);

  const onSelectProduct = (e: any) => {
    let tempProds = [...relatedProducts.products];

    let isValid = true;
    for (let i in tempProds) {
      if (e._id === tempProds[i]._id) {
        isValid = false;
      }
    }

    if (isValid) {
      tempProds.push(e);
      setRelatedProducts((prev: any) => {
        return {
          ...prev,
          type: prev.type,
          products: tempProds,
        };
      });
    }

    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setSubCategories([]);
    setProducts([]);
  };

  const handleDeleteRelatedProd = (_id: string) => {
    const tempProds = [...relatedProducts.products];
    const filterData = tempProds.filter((el) => el._id !== _id);

    setRelatedProducts((prev: any) => {
      return {
        ...prev,
        type: prev.type,
        products: filterData,
      };
    });
  };

  return (
    <>
      <div>
        <div className="flex justify-sb align-c pb-30">
          <p className="page-title">매거진 등록</p>
          <p className="font-desc">
            <span className="font-red mr-4">*</span>
            <span>필수입력</span>
          </p>
        </div>

        {/* 카테고리/기본정보 */}
        <div>
          <div className="product-field-wrapper mt-2 w100p">
            <div className="product-field mr-20">
              <p>
                제목<span className="font-red">*</span>
              </p>
            </div>

            <div className="flex1">
              <InputR
                size="full"
                placeholer={"제목을 입력해 주세요"}
                value={title}
                onChange={(e: any) => setTitle(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-2 field-list-wrapper">
            <div className="product-field mr-20">
              <p>
                대표이미지
                <br />
                (썸네일)
                <span className="font-red">*</span>
              </p>
            </div>

            <div className="flex f-direction-column">
              <div className="list-header-content align-c" style={{ border: "none" }}>
                <div className="mr-12">
                  <input
                    style={{ display: "none" }}
                    ref={(el) => (inputFileRef.current[0] = el)}
                    onChange={(e) => handleFileChange(e, "thumbnail")}
                    type="file"
                  />
                  <ButtonR
                    name={`이미지 추가 ${files?.thumbnail.length}/1`}
                    onClick={() => handleUploadClick(0)}
                  />
                </div>

                <p className="font-desc">이미지 1장, 1080px x 1080px</p>
              </div>

              {files?.thumbnail.length !== 0 && (
                <img src={files?.thumbnail[0]?.fileUrl} style={{ width: 136, height: "auto" }} />
              )}

              {files?.thumbnail.length !== 0 && (
                <div className="flex mt-16 mb-16">
                  <ButtonR
                    name={`변경`}
                    color={"white"}
                    onClick={() => {}}
                    // onClick={() => handleUploadClick(0)}
                    styles={{ marginRight: 4 }}
                  />
                  <ButtonR
                    name={`삭제`}
                    color={"white"}
                    onClick={() => handleDeleteFile("thumbnail", files?.thumbnail[0]?.fileUrl)}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mt-2 field-list-wrapper">
            <div className="product-field mr-20">
              <p>
                상세이미지 등록
                <span className="font-red">*</span>
              </p>
            </div>

            <div className="flex f-direction-column">
              <div className="list-header-content align-c" style={{ border: "none" }}>
                <div className="mr-12">
                  <input
                    style={{ display: "none" }}
                    ref={(el) => (inputFileRef.current[1] = el)}
                    onChange={(e) => handleFileChange(e, "detailImg")}
                    type="file"
                  />
                  <ButtonR
                    name={`이미지 추가 ${files?.thumbnail.length}/1`}
                    onClick={() => handleUploadClick(1)}
                  />
                </div>

                <p className="font-desc">이미지 1장, 1080px x 1080px</p>
              </div>

              {files?.detailImg.length !== 0 && (
                <img src={files?.detailImg[0]?.fileUrl} style={{ width: 136, height: "auto" }} />
              )}

              {files?.detailImg?.length !== 0 && (
                <div className="flex mt-16 mb-16">
                  <ButtonR
                    name={`변경`}
                    color={"white"}
                    onClick={() => {}}
                    // onClick={() => handleUploadClick(0)}
                    styles={{ marginRight: 4 }}
                  />
                  <ButtonR
                    name={`삭제`}
                    color={"white"}
                    onClick={() => handleDeleteFile("detailImg", files?.detailImg[0]?.fileUrl)}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="field-list-wrapper mt-2">
            <div className="product-field mr-20">
              <p>
                요약 내용<span className="font-red">*</span>
              </p>
            </div>

            <div className="mt-16 mb-16 flex1" style={{ position: "relative" }}>
              <textarea
                className="input-textarea"
                placeholder="내용을 입력해 주세요"
                value={desc}
                onChange={(e) => onChangeHandler(e)}
              />
              <div
                className="font-12"
                style={{
                  position: "absolute",
                  bottom: 10,
                  right: 10,
                  fontWeight: 400,
                  color: "rgba(0,0,0,0.4)",
                }}
              >
                {txtLength}/100
              </div>
            </div>
          </div>

          <div className="mt-2 field-list-wrapper">
            <div className="product-field mr-20">
              <p>
                상세내용
                <span className="font-red">*</span>
              </p>
            </div>

            <div style={{ flex: 1 }}>
              <div className="list-header">
                <div className="text-center w10p">순서</div>
                <div className="text-center w80p">상품정보</div>
                <div className="text-center w10p">삭제/추가</div>
              </div>

              <div className="list-header-content">
                <div className="text-center w10p">
                  <img src={up_g} style={{ width: 28, height: "auto" }} className="mr-4 cursor" />
                  <img src={down_g} style={{ width: 28, height: "auto" }} className="cursor" />
                </div>
                <div className="text-center w80p">
                  <div className="flex align-c mb-10">
                    <div className="w10p" style={{ width: "10%" }}></div>
                    <p className="text-left font-12 font-gray">
                      추가 버튼을 클릭해서 정보를 추가해주세요.
                    </p>
                  </div>
                  <div className="flex align-c">
                    <div
                      className="font-14 text-center font-bold flex align-c justify-c"
                      style={{ width: "10%" }}
                    >
                      요약
                    </div>

                    <div style={{ width: "80%" }}>
                      <input
                        value={contentForm?.title}
                        onChange={(e) => {
                          setContentForm((prevState: any) => {
                            return {
                              ...prevState,
                              title: e.target.value,
                            };
                          });
                        }}
                        className="input-desc"
                        placeholder="50자 이내로 입력해 주세요.(필수)"
                      />
                    </div>
                  </div>
                  <div className="flex align-c mt-10">
                    <div className="font-14 font-bold" style={{ width: "10%" }}>
                      설명
                    </div>
                    <div style={{ width: "80%" }}>
                      <textarea
                        value={contentForm?.detail}
                        onChange={(e) => {
                          setContentForm((prevState: any) => {
                            return {
                              ...prevState,
                              detail: e.target.value,
                            };
                          });
                        }}
                        className="input-textarea"
                        placeholder="200자 이내로 입력해주세요(선택)"
                      />
                    </div>
                  </div>

                  <div className="flex mt-10">
                    <div className="font-14 font-bold" style={{ width: "10%" }}>
                      이미지
                    </div>
                    <div
                      className="mr-12 flex"
                      style={{
                        flexDirection: "column",
                      }}
                    >
                      <div className="flex align-c">
                        <input
                          ref={(el) => (inputFileRef.current[2] = el)}
                          onChange={(e: any) => handleFileChange2(e, "details")}
                          style={{ display: "none" }}
                          type="file"
                        />
                        <ButtonR
                          onClick={() => handleUploadClick(2)}
                          name="이미지 추가 0/5"
                          styles={{ marginRight: 12 }}
                        />

                        <p className="font-desc">이미지 최소 1장 ~ 최대 5장, 가로 1080px</p>
                      </div>

                      <div
                        className={`text-left flex ${contentForm.images.length !== 0 && "mt-10"}`}
                      >
                        {contentForm.images?.length !== 0 &&
                          contentForm.images?.map((el: any, i: number) => (
                            <div key={i} className="mr-12">
                              <img src={el.imgUrl} style={{ width: 136, height: "auto" }} />
                              <div className="flex mb-16">
                                <ButtonR
                                  name={`변경`}
                                  color={"white"}
                                  onClick={() => {}}
                                  // onClick={() => handleUploadClick(1)}
                                  styles={{ marginRight: 4 }}
                                />
                                <ButtonR
                                  name={`삭제`}
                                  color={"white"}
                                  onClick={() => {}}
                                  // handleDeleteFile(
                                  //   "additionalImg",
                                  //   files?.additionalImg[i]?.fileUrl
                                  // )
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center w10p flex justify-c">
                  <ButtonR onClick={() => handleAddForm("details")} name="추가" />
                </div>
              </div>

              {contents.map((contentItem: any, i: number) => (
                <div key={i} className="list-header-content">
                  <div className="text-center w10p">
                    <img
                      onClick={() => handleMoveOrder("details", contents, i, i - 1)}
                      src={i === 0 ? up_g : up_b}
                      style={{ width: 28, height: "auto" }}
                      className="mr-4 cursor"
                    />
                    <img
                      onClick={() => handleMoveOrder("details", contents, i, i + 1)}
                      src={i === contents.length - 1 ? down_g : down_b}
                      style={{ width: 28, height: "auto" }}
                      className="cursor"
                    />
                  </div>
                  <div className="text-center w80p">
                    <div className="flex align-c">
                      <div
                        className="font-14 text-center font-bold flex align-c justify-c"
                        style={{ width: "10%" }}
                      >
                        요약
                      </div>

                      <div style={{ width: "80%" }}>
                        <input
                          value={contentItem?.title}
                          // value={pointForm?.summary}
                          // onChange={(e) => {
                          //   setPointForm((prevState: IPoint) => {
                          //     return {
                          //       ...prevState,
                          //       summary: e.target.value,
                          //     };
                          //   });
                          // }}
                          className="input-desc"
                          placeholder="50자 이내로 입력해 주세요.(필수)"
                        />
                      </div>
                    </div>
                    <div className="flex align-c mt-10">
                      <div className="font-14 font-bold" style={{ width: "10%" }}>
                        설명
                      </div>
                      <div style={{ width: "80%" }}>
                        <textarea
                          value={contentItem?.detail}
                          // value={pointForm?.desc}
                          // onChange={(e) => {
                          //   setPointForm((prevState: IPoint) => {
                          //     return {
                          //       ...prevState,
                          //       desc: e.target.value,
                          //     };
                          //   });
                          // }}
                          className="input-textarea"
                          placeholder="200자 이내로 입력해주세요(선택)"
                        />
                      </div>
                    </div>

                    <div className="flex mt-10">
                      <div className="font-14 font-bold" style={{ width: "10%" }}>
                        이미지
                      </div>
                      <div
                        className="mr-12 flex"
                        style={{
                          flexDirection: "column",
                        }}
                      >
                        <div
                          className={`text-left flex ${contentForm.images.length !== 0 && "mt-10"}`}
                        >
                          {contentItem.images?.length !== 0 &&
                            contentItem.images?.map((el: any, i: number) => (
                              <div key={i} className="mr-12">
                                <img src={el.imgUrl} style={{ width: 136, height: "auto" }} />
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center w10p">
                    <button
                      onClick={() => handleDeleteListItem("details", i)}
                      className="btn-add mr-4"
                    >
                      삭제
                    </button>
                    {/* <button onClick={() => handleAddForm("point")} className="btn-add">
                      추가
                    </button> */}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="field-list-wrapper mt-2">
            <div className="product-field mr-20">
              <p>연관 추천상품</p>
            </div>

            <div style={{ flex: 1 }} className="mt-16 mb-16">
              <div className="flex mt-10">
                <SelectBox
                  containerStyles={{ marginRight: 8 }}
                  placeholder={"카테고리 대분류"}
                  defaultValue={null}
                  onChange={(e: any) => setSelectedCategory(e)}
                  options={categories}
                  noOptionsMessage={"카테고리가 없습니다."}
                />
                <SelectBox
                  placeholder={"카테고리 하위분류"}
                  defaultValue={null}
                  onChange={(e: any) => setSelectedSubCategory(e)}
                  options={subCategories}
                  noOptionsMessage={"카테고리가 없습니다."}
                />
              </div>

              <div className="flex align-c mt-4">
                <SelectBox
                  placeholder={"상품선택"}
                  defaultValue={null}
                  onChange={(e: any) => onSelectProduct(e)}
                  options={products}
                  noOptionsMessage={"상품이 없습니다."}
                />
                {/* <p className="font-12">※ 최소 1개 ~ 최대 4개 선택 가능합니다.</p> */}
              </div>

              {relatedProducts?.products?.length !== 0 && (
                <div className="mt-4">
                  {relatedProducts.products?.map((item: any, i: number) => (
                    <div key={i} className="flex justify-sb align-c border-bottom-gray pt-10 pb-10">
                      <div className="flex align-c">
                        <img src={item.thumbnail} className="list-img mr-10" />
                        <p>{item.productNameK}</p>
                      </div>

                      <ButtonR
                        onClick={() => handleDeleteRelatedProd(item._id)}
                        color={"white"}
                        name="삭제"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="product-field-wrapper mt-2 w100p">
            <div className="product-field mr-20">
              <p>공개시작일</p>
            </div>

            <div className="flex1">
              <input
                style={{ border: "1px solid #cccccc", padding: "4px 10px", color: "#979797" }}
                type="date"
                value={dates.openingDate}
                onChange={(e: any) => {
                  setDates((prev) => {
                    return {
                      ...prev,
                      openingDate: e.target.value,
                    };
                  });
                }}
              />
            </div>
          </div>

          <div className="product-field-wrapper mt-2 w100p">
            <div className="product-field mr-20">
              <p>공개여부</p>
            </div>

            <div onClick={() => setOpenStatus(true)} className="checkbox-c mr-4 cursor">
              {openStatus && <div className="checkbox-c-filled"></div>}
            </div>

            <p onClick={() => setOpenStatus(true)} className="mr-30 cursor">
              공개
            </p>

            <div onClick={() => setOpenStatus(false)} className="checkbox-c mr-4 cursor">
              {!openStatus && <div className="checkbox-c-filled" />}
            </div>

            <p onClick={() => setOpenStatus(false)} className="mr-35 cursor">
              비공개
            </p>
          </div>
        </div>

        <div className="flex justify-fe align-c mt-34">
          <button onClick={() => navigate(-1)} className="btn-add mr-4 pl-30 pr-30">
            취소
          </button>
          <button onClick={handleAddProduct} className="btn-add-b pl-30 pr-30">
            {loading ? "상품 등록중" : "저장"}
          </button>
        </div>
      </div>
    </>
  );
}
