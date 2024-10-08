import React, { useState, useEffect } from 'react';
import * as G from '../style/getStyle';
import { getQRCode } from '../api/apiService';
import { useParams } from 'react-router-dom';
import save from '../assets/SaveVector.png';

// URL-safe Base64를 디코딩하는 함수
const decodeBase64Url = (encodedId) => {
    // Base64 패딩 복구
    const paddedEncodedId = encodedId + '='.repeat((4 - encodedId.length % 4) % 4);
    // Base64 디코딩
    return atob(paddedEncodedId);
};

const GetPhoto = () => {
    const { id } = useParams(); // useParams을 이용하여 URL 매개변수에서 인코딩된 id를 추출
    const [photoData, setPhotoData] = useState(null);

    useEffect(() => {
        console.log('Encoded ID from URL:', id);

        const fetchPhotoAndQR = async () => {
            try {
                // 인코딩된 id를 디코딩
                const decodedId = decodeBase64Url(id);
                console.log('Decoded ID:', decodedId);

                // 디코딩된 ID로 API 요청
                const data = await getQRCode(decodedId);  
                setPhotoData(data);  // 받아온 데이터 저장
            } catch (error) {
                console.error('Error fetching photo and QR code:', error);
            }
        };

        if (id) {
            fetchPhotoAndQR();
        }
    }, [id]);

    const handleDownload = () => {
        if (photoData && photoData.photo) {
            const link = document.createElement('a');
            link.href = photoData.photo;
            link.download = 'myPhoto.png';  // 다운로드될 파일 이름 지정
            link.click();  // 다운로드 트리거
        }
    };

    if (!photoData) {
        return <div>Loading...</div>;  // 데이터를 불러오는 중일 때 표시
    }

    return (
        <>
            <G.GetPhoto>
                {/* 받아온 photo URL로 이미지 출력 */}
                <G.FourCutPhoto src={photoData.photo} alt="Fetched from server" />

                {/* 다운로드하기 버튼 */}
                <button onClick={handleDownload}>
                    사진 다운로드하기 <img id='save' src={save} />
                </button>

        
            </G.GetPhoto>
        </>
    );
};

export default GetPhoto;