import Head from "@/components/shared/Head";
import React from "react";

const tos = () => {
  return (
    <div className="pt-20 px-4 md:px-12 space-y-4">
      <Head
        title="Điều khoản dịch vụ - Kaguya"
        description="Điều khoản dịch vụ tại Kaguya"
      />

      <h1 className="text-2xl font-bold">Điều khoản dịch vụ</h1>

      <h4 className="text-lg font-semibold">1. Điều Kiện</h4>
      <p>
        Bằng cách truy cập trang web này, bạn đồng ý bị ràng buộc bởi những Điều
        khoản và Điều kiện Sử dụng trang web và đồng ý rằng bạn chịu trách nhiệm
        về thỏa thuận với bất kỳ luật địa phương hiện hành nào. Nếu bạn không
        đồng ý với bất kỳ điều khoản nào trong số này, bạn bị cấm truy cập trang
        web này. Các tài liệu trong trang web này có thể đã đã được bảo vệ bởi
        bản quyền và luật thương hiệu.
      </p>
      <h4 className="text-lg font-semibold">2. Sửa Đổi và lỗi in, lỗi viết</h4>
      <p>
        Các tài liệu xuất hiện trên Kaguya có thể bao gồm các lỗi kỹ thuật, đánh
        máy hoặc nhiếp ảnh. Kaguya sẽ không hứa rằng bất kỳ tài liệu nào trong
        trang web này là chính xác, đầy đủ hoặc hiện tại. Kaguya có thể thay đổi
        các tài liệu có trên trang web của mình bất cứ lúc nào mà không cần
        thông báo. Kaguya không đưa ra bất kỳ cam kết nào để cập nhật các tài
        liệu.
      </p>
      <h4 className="text-lg font-semibold">
        3. Sửa đổi điều khoản sử dụng trang web
      </h4>
      <p>
        Kaguya có thể sửa đổi các Điều khoản sử dụng này cho trang web của mình
        bất cứ lúc nào mà không cần thông báo trước. Bằng cách sử dụng trang web
        này, bạn đồng ý bị ràng buộc bởi phiên bản hiện tại của các Điều khoản
        và Điều kiện sử dụng này.
      </p>
      <h4 className="text-lg font-semibold">4. Quyền riêng tư của bạn</h4>
      <p>Vui lòng đọc chính sách bảo mật của chúng tôi. .</p>
      <h4 className="text-lg font-semibold">5. Luật quản lý</h4>
      <p>
        Bất kỳ khiếu nại nào liên quan đến Kaguya sẽ được điều chỉnh bởi luật
        của BQ mà không liên quan đến xung đột của các quy định pháp luật.
      </p>
    </div>
  );
};

export default tos;
