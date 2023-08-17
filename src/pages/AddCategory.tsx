import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ButtonR from "../components/ButtonR";
import InputR from "../components/InputR";
import forward from "../images/Forward.png";
import up_g from "../images/up_g.png";
import down_g from "../images/down_g.png";
import up_b from "../images/up_b.png";
import down_b from "../images/down_b.png";
import { moveValue } from "../common/utils";
import { postAddCategory } from "../common/apis";
import { ISubCategory } from "../common/interfacs";

const AddCategory = () => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [subCategoryBool, setSubCategoryBool] = useState<boolean>(false);
  const [openStatus, setOpenStatus] = useState<boolean>(true);
  const [subCategories, setSubCategories] = useState<any>([]);
  const [subCategoryForm, setSubCategoryForm] = useState<ISubCategory>({
    optionName: "",
    URL: "",
    openStatus: true,
  });

  const handleAddForm = () => {
    let tempArr = [];

    tempArr = [...subCategories];
    tempArr.push(subCategoryForm);
    setSubCategories(tempArr);

    setSubCategoryForm({
      optionName: "",
      URL: "",
      openStatus: true,
    });
  };

  const handleDeleteListItem = (i: number) => {
    let tempArr = [];

    tempArr = [...subCategories];
    tempArr.splice(i, 1);
    setSubCategories(tempArr);
  };

  const handleMoveOrder = (array: object[], fromIndex: number, toIndex: number) => {
    const newArr: any = moveValue(array, fromIndex, toIndex);

    setSubCategories([...newArr]);
  };

  const handleValidForm = () => {
    let isValid = true;
    if (name === "") return false;
    if (url === "") return false;

    return isValid;
  };

  const handleAddCategory = async (): Promise<any> => {
    const isValid = handleValidForm();
    if (!isValid) return alert("필수 입력 사항을 확인해 주세요.");
    const _body: any = {
      collection: "categories",
      name,
      url,
      openStatus,
      subCategories,
    };
    const postResult = await postAddCategory(_body);
    if (postResult.result && postResult.status === 200) {
      alert("카테고리 등록이 완료되었습니다.");
      navigate(-1);
    }
  };

  return (
    <div>
      <div className="flex align-c pb-30">
        <img onClick={() => navigate(-1)} className="img-close cursor mr-4" src={forward} />
        <p className="page-title mt-3">카테고리 등록</p>
      </div>

      <p className="font-category">카테고리 정보</p>

      <div className="product-field-wrapper mt-13 w100p">
        <div className="product-field mr-20">
          <p>
            카테고리명<span className="font-red">*</span>
          </p>
        </div>

        <div className="flex1">
          <InputR
            size="full"
            value={name}
            onChange={(e: any) => setName(e.target.value)}
            // placeholer={"영문입력"}
          />
        </div>
      </div>

      <div className="product-field-wrapper mt-2 w100p">
        <div className="product-field mr-20">
          <p>
            URL<span className="font-red">*</span>
          </p>
        </div>

        <div className="flex1">
          <InputR
            size="full"
            value={url}
            onChange={(e: any) => setUrl(e.target.value)}
            // placeholer={"영문입력"}
          />
        </div>
      </div>

      <div className="product-field-wrapper mt-2 w100p">
        <div className="product-field mr-20">
          <p>공개여부</p>
        </div>

        <div onClick={() => setOpenStatus(true)} className="checkbox-c mr-4 cursor">
          {openStatus && <div className="checkbox-c-filled" />}
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

      <div className="mt-30">
        <p className="font-category">하위분류</p>

        <div className="product-field-wrapper w100p">
          <div className="product-field mr-20 mt-13">
            <p>하위분류 여부</p>
          </div>

          <div onClick={() => setSubCategoryBool(false)} className="checkbox-c mr-4 cursor">
            {!subCategoryBool && <div className="checkbox-c-filled"></div>}
          </div>

          <p onClick={() => setSubCategoryBool(false)} className="mr-30 cursor">
            없음
          </p>

          <div onClick={() => setSubCategoryBool(true)} className="checkbox-c mr-4 cursor">
            {subCategoryBool && <div className="checkbox-c-filled" />}
          </div>

          <p onClick={() => setSubCategoryBool(true)} className="mr-35 cursor">
            있음
          </p>
        </div>
      </div>

      {subCategoryBool && (
        <div className="mt-2 field-list-wrapper">
          <div className="product-field mr-20">
            <p>하위분류 입력</p>
          </div>

          <div style={{ flex: 1 }}>
            <div className="list-header">
              <div className="text-center w20p">순서</div>
              <div className="text-center w20p">옵션명</div>
              <div className="text-center w20p">URL</div>
              <div className="text-center w20p">공개여부</div>
              <div className="text-center w20p">삭제/추가</div>
            </div>

            <div className="list-header-content">
              <div className="text-center w20p">
                <img src={up_g} style={{ width: 28, height: "auto" }} className="mr-4 cursor" />
                <img src={down_g} style={{ width: 28, height: "auto" }} className="cursor" />
              </div>
              <div className="text-center w20p">
                <div className="mr-4 ml-4">
                  <InputR
                    size={"full"}
                    value={subCategoryForm.optionName}
                    onChange={(e: any) =>
                      setSubCategoryForm((prev: ISubCategory) => {
                        return {
                          ...prev,
                          optionName: e.target.value,
                        };
                      })
                    }
                  />
                </div>
              </div>

              <div className="text-center w20p">
                <div className="mr-4 ml-4">
                  <InputR
                    value={subCategoryForm.URL}
                    size={"full"}
                    onChange={(e: any) =>
                      setSubCategoryForm((prev: ISubCategory) => {
                        return {
                          ...prev,
                          URL: e.target.value,
                        };
                      })
                    }
                  />
                </div>
              </div>

              <div className="text-center w20p flex align-c justify-c">
                <div
                  onClick={() => {
                    setSubCategoryForm((prev: ISubCategory) => {
                      return {
                        ...prev,
                        openStatus: true,
                      };
                    });
                  }}
                  className="checkbox-c mr-4 cursor"
                >
                  {subCategoryForm.openStatus && <div className="checkbox-c-filled" />}
                </div>

                <p
                  onClick={() => {
                    setSubCategoryForm((prev: ISubCategory) => {
                      return {
                        ...prev,
                        openStatus: true,
                      };
                    });
                  }}
                  className="mr-30 cursor"
                >
                  공개
                </p>

                <div
                  onClick={() => {
                    setSubCategoryForm((prev: ISubCategory) => {
                      return {
                        ...prev,
                        openStatus: false,
                      };
                    });
                  }}
                  className="checkbox-c mr-4 cursor"
                >
                  {!subCategoryForm.openStatus && <div className="checkbox-c-filled" />}
                </div>

                <p
                  onClick={() => {
                    setSubCategoryForm((prev: ISubCategory) => {
                      return {
                        ...prev,
                        openStatus: false,
                      };
                    });
                  }}
                  className="mr-35 cursor"
                >
                  비공개
                </p>
              </div>

              <div className="text-center w20p">
                <ButtonR onClick={handleAddForm} name={"추가"} />
              </div>
            </div>

            {subCategories.map((aSub: ISubCategory, i: number) => (
              <div key={i} className="list-header-content">
                <div className="text-center w20p">
                  <img
                    onClick={() => handleMoveOrder(subCategories, i, i - 1)}
                    src={i === 0 ? up_g : up_b}
                    style={{ width: 28, height: "auto" }}
                    className="mr-4 cursor"
                  />
                  <img
                    onClick={() => handleMoveOrder(subCategories, i, i + 1)}
                    src={i === subCategories.length - 1 ? down_g : down_b}
                    style={{ width: 28, height: "auto" }}
                    className="cursor"
                  />
                </div>
                <div className="text-center w20p">
                  <div className="mr-4 ml-4">
                    <InputR size={"full"} value={aSub.optionName} />
                  </div>
                </div>

                <div className="text-center w20p">
                  <div className="mr-4 ml-4">
                    <InputR size={"full"} value={aSub.URL} />
                  </div>
                </div>

                <div className="text-center w20p flex align-c justify-c">
                  <div className="checkbox-c mr-4 cursor">
                    {aSub.openStatus && <div className="checkbox-c-filled" />}
                  </div>

                  <p className="mr-30">공개</p>

                  <div className="checkbox-c mr-4 cursor">
                    {!aSub.openStatus && <div className="checkbox-c-filled" />}
                  </div>

                  <p className="mr-35">비공개</p>
                </div>

                <div className="text-center w20p">
                  <ButtonR onClick={() => handleDeleteListItem(i)} color={"white"} name={"삭제"} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-fe mt-10">
        <ButtonR name={"취소"} onClick={() => navigate(-1)} styleClass={"mr-4"} color={"white"} />
        <ButtonR name={"저장"} onClick={handleAddCategory} />
      </div>
    </div>
  );
};

export default AddCategory;
