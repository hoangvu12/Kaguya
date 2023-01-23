import Head from "@/components/shared/Head";
import React from "react";

const dmca = () => {
  return (
    <div className="pt-20 px-4 md:px-12 space-y-4">
      <Head title="DMCA - CrowsNest" description="DMCA CrowsNest" />

      <h1 className="text-2xl font-bold">DMCA takedown request</h1>

      <p>
       We value the intellectual property rights of others and ask that you
        Our users do the same. The Millennium Copyright Act
        (DMCA) has established a process for dealing with complaints
        about copyright infringement. If you own the copyright or have the right to act on behalf of
        copyright owner and would like to report a claim that a third party is infringing
        violate that material, please file a DMCA report on our Contact page
        I and we will take appropriate action
      </p>
      <p></p>
      <h4 className="text-xl font-semibold">DMCA Report Requirements</h4>
      <ul className="px-4 list-inside list-disc">
        <li>A description of the copyrighted work that you believe is being infringed;</li>
        <li>
          A description of the material you believe is infringing and you wish to remove or access
          access that you want to disable and the URL or other location of that document;
        </li>
        <li>
          Name, title (if agent), address, phone number and address
          your email;
        </li>
        <li>
          A statement that you agree to the authority:{" "}
          <i>
            &quot;I strongly believe that the use of copyrighted material
            which I am complaining about is not authorized by the copyright owner, the
            on behalf of the copyright owner or as permitted by law (for example, using
            legal use)&quot;
          </i>
          ;
        </li>
        <li>
         A statement that you did not perjure:{" "}
          <i>
            &quot;The information in this notice is accurate and, under penalty of
            perjury, I am the owner, or authorized to act on behalf of
            to the owner, copyright or exclusive right allegedly infringing
            offense&quot;
          </i>
          ;
        </li>
        <li>
         Electronic or physical signature of the copyright owner or authorized person
          the right to act on behalf of the owner.
        </li>
      </ul>
      <p></p>
      <p>
       Your DMCA takedown request must be emailed:{" "}
        portal@crowsnest.live
      </p>
      <p>
       We will then review your DMCA request and take action
        appropriate action, including removal of content from the site.
      </p>
    </div>
  );
};

export default dmca;
