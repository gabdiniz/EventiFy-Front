import { BsUpload, BsXCircle } from "react-icons/bs";
import "./InputMultipleFiles.scss";
import { forwardRef } from "react";

export const InputMultipleFiles = forwardRef(
  (
    { onChange, selectedImages, onClick, label, multiple = true, ...props },
    ref
  ) => {
    return (
      <div className="input-multiple-container">
        <label className="input-file-label">
          <BsUpload className="icon-upload-img" size={30} />
          <input
            type="file"
            name="imgs"
            ref={ref}
            onChange={onChange}
            multiple={multiple}
            accept="image/*"
            hidden
          />
          <span>{label}</span>
        </label>
        <div className="images-input-files">
          {selectedImages &&
            selectedImages.map((image, index) => {
              return (
                <div key={image} className="container-img-file">
                  <button
                    ref={ref}
                    className="btn-delete-img"
                    onClick={() => onClick(image)}
                  >
                    <BsXCircle size={30} />
                  </button>
                  <img
                    src={image}
                    className="img-file-up"
                    alt="imagens selecionadas"
                  />
                </div>
              );
            })}
        </div>
      </div>
    );
  }
);
