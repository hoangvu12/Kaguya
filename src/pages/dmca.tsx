import Head from "@/components/shared/Head";
import React from "react";

const dmca = () => {
  return (
    <div className="pt-20 px-4 md:px-12 space-y-4">
      <Head title="DMCA - Kaguya" description="DMCA Kaguya" />

      <h1 className="text-2xl font-bold">Yêu cầu gỡ xuống theo DMCA</h1>

      <p>
        Chúng tôi coi trọng quyền sở hữu trí tuệ của người khác và yêu cầu Người
        dùng của chúng tôi cũng làm như vậy. Đạo luật Bản quyền Thiên niên kỷ Kỹ
        thuật số (DMCA) đã thiết lập một quy trình để giải quyết các khiếu nại
        về vi phạm bản quyền. Nếu bạn sở hữu bản quyền hoặc có quyền thay mặt
        chủ sở hữu bản quyền và muốn báo cáo khiếu nại rằng bên thứ ba đang vi
        phạm tài liệu đó, vui lòng gửi báo cáo DMCA trên trang Liên hệ của chúng
        tôi và chúng tôi sẽ xử lý hành động thích hợp
      </p>
      <p></p>
      <h4 className="text-xl font-semibold">Yêu cầu đối với Báo cáo DMCA</h4>
      <ul className="px-4 list-inside list-disc">
        <li>Mô tả về tác phẩm có bản quyền mà bạn cho rằng đang bị vi phạm;</li>
        <li>
          Mô tả về tài liệu bạn cho là vi phạm và bạn muốn xóa hoặc quyền truy
          cập mà bạn muốn vô hiệu hóa và URL hoặc vị trí khác của tài liệu đó;
        </li>
        <li>
          Tên, chức danh (nếu là đại lý), địa chỉ, số điện thoại và địa chỉ
          email của bạn;
        </li>
        <li>
          Một tuyên bố rằng bạn đồng ý với thẩm quyền:{" "}
          <i>
            &quot;Tôi thực sự tin tưởng rằng việc sử dụng tài liệu có bản quyền
            mà tôi đang khiếu nại không được chủ sở hữu bản quyền, người đại
            diện của chủ sở hữu bản quyền hoặc luật pháp cho phép (ví dụ: sử
            dụng hợp pháp)&quot;
          </i>
          ;
        </li>
        <li>
          Một tuyên bố rằng bạn không khai man:{" "}
          <i>
            &quot;Thông tin trong thông báo này là chính xác và, dưới hình phạt
            khai man, tôi là chủ sở hữu, hoặc được ủy quyền hành động thay mặt
            cho chủ sở hữu, bản quyền hoặc quyền độc quyền bị cáo buộc vi
            phạm&quot;
          </i>
          ;
        </li>
        <li>
          Chữ ký điện tử hoặc vật lý của chủ sở hữu bản quyền hoặc người được ủy
          quyền hành động thay mặt chủ sở hữu.
        </li>
      </ul>
      <p></p>
      <p>
        Yêu cầu gỡ xuống DMCA của bạn phải được gửi tới email:{" "}
        hggaming07@gmail.com
      </p>
      <p>
        Sau đó, chúng tôi sẽ xem xét yêu cầu DMCA của bạn và thực hiện các hành
        động thích hợp, bao gồm cả việc xóa nội dung khỏi trang web.
      </p>
    </div>
  );
};

export default dmca;
