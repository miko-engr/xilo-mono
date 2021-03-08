import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormCompletedPageResponse } from '../models';
import { NEW_CLIENT_URL } from '../../../../app/constants';
import { map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

@Injectable()
export class PageService {
  constructor(private http: HttpClient) {}
  defaultPage(companyId) {
    return {
      banner: {
        title: `<h1>Done! An agent will be in contact with you shortly </h1>`,
        link: `<button>Go to Home Page</button>`,
        image: `<svg xmlns="http://www.w3.org/2000/svg" width="232" height="232" viewBox="0 0 232 232" fill="none">
      <path opacity="0.18" d="M131.238 220.933C141.022 214.634 149.619 205.999 159.445 199.847C171.9 192.102 185.957 188.559 200.041 189.613C203.954 189.914 208.024 190.545 211.695 188.927C214.987 187.469 217.535 184.362 219.704 181.126C232.003 162.81 235.417 136.877 228.395 115.092C225.853 107.199 222.03 99.7724 220.964 91.4017C218.511 72.1846 231.179 53.7335 229.199 34.4429C227.833 21.1638 219.304 9.78428 208.843 4.36723C198.381 -1.04983 186.271 -1.01919 175.19 2.22859C163.084 5.76439 151.956 12.9034 139.961 16.9355C117.268 24.5219 92.9893 20.5204 69.5875 23.9704C46.1857 27.4204 20.6411 42.4276 16.0091 69.4393C13.2099 85.7518 18.74 103.02 15.1793 119.13C12.1806 132.679 3.10029 143.691 0.736998 157.418C-5.5651 194.295 30.0575 204.651 50.1455 218.255C74.7184 234.893 105.998 237.19 131.238 220.933Z" fill="#6E71FF"/>
      <path d="M144.428 153.514C144.729 156.293 145.018 159.168 144.184 161.857C142.708 166.581 138.119 169.558 133.704 171.779C124.796 176.258 115.17 179.371 105.884 183.035C102.765 184.274 99.274 186.019 98.5295 189.286C98.1958 190.749 98.4846 192.321 97.9648 193.72C97.445 195.119 95.462 196.146 94.4865 195.004C94.1216 194.468 93.9414 193.828 93.9731 193.181L93.5688 185.711C93.434 183.215 93.2993 180.667 93.9282 178.241C94.5571 175.815 96.0652 173.492 98.3691 172.517C99.1456 172.196 99.9799 172.029 100.769 171.721C103.696 170.585 105.486 167.697 107.251 165.092C111.403 158.976 116.877 153.271 123.936 151.191C121.72 147.779 120.23 143.946 119.561 139.933C118.892 135.919 119.058 131.811 120.047 127.864C121.081 123.846 123.173 119.848 126.773 117.788C128.161 116.997 129.734 116.59 131.331 116.609C132.929 116.628 134.492 117.073 135.86 117.897C139.069 119.97 139.537 123.718 140.385 127.183C142.522 135.828 143.478 144.684 144.428 153.514Z" fill="#3E3E54"/>
      <path d="M144.428 153.848C144.729 156.633 145.018 159.501 144.184 162.19C142.708 166.914 138.119 169.891 133.704 172.118C124.796 176.617 115.17 179.717 105.884 183.4C102.765 184.632 99.274 186.378 98.5295 189.651C98.1958 191.108 98.4846 192.686 97.9648 194.085C97.445 195.484 95.462 196.505 94.4865 195.369C94.1216 194.833 93.9414 194.194 93.9731 193.546L93.5688 186.076C93.434 183.574 93.2993 181.032 93.9282 178.606C94.5571 176.181 96.0652 173.857 98.3691 172.882C99.1456 172.555 99.9799 172.394 100.769 172.086C103.696 170.944 105.486 168.056 107.251 165.457C111.403 159.341 116.877 153.636 123.936 151.557C121.72 148.143 120.231 144.309 119.562 140.295C118.893 136.28 119.058 132.17 120.047 128.222C121.081 124.205 123.173 120.213 126.773 118.153C128.161 117.362 129.734 116.955 131.331 116.974C132.929 116.993 134.492 117.438 135.86 118.263C139.069 120.335 139.537 124.083 140.385 127.549C142.522 136.187 143.478 145.036 144.428 153.848Z" fill="url(#paint0_linear)"/>
      <path d="M128.288 118.924C128.291 124.668 126.923 130.329 124.296 135.436C122.929 138.087 121.222 140.615 120.446 143.477C115.164 162.377 93.736 172.87 77.7436 184.826C71.249 189.677 64.1192 194.606 61.2121 202.05C60.8206 203.064 60.4227 204.206 59.4344 204.713C58.0161 205.432 56.2256 204.258 55.7187 202.788C55.2117 201.319 55.6545 199.714 56.0845 198.212L58.3691 190.21C58.5573 189.296 58.9476 188.437 59.5114 187.694C60.1933 187.057 60.9707 186.531 61.8153 186.135C67.7066 182.708 69.5612 175.475 72.6288 169.52C76.1506 162.763 81.6038 157.207 88.2939 153.559C90.0652 152.59 91.9648 151.724 93.3253 150.254C94.6858 148.785 95.443 146.661 96.1169 144.69C98.3736 138.12 100.963 131.668 103.876 125.361C105.037 122.839 111.75 111.242 113.714 109.221C118.751 104.055 123.411 113.604 128.288 118.924Z" fill="#3E3E54"/>
      <path d="M152.681 69.894C152.681 70.709 152.623 71.5497 152.623 72.3969C152.623 75.1115 152.367 78.102 150.441 80.0144C148.972 81.4712 146.841 81.9782 144.877 82.6199C130.656 87.2662 121.569 100.993 108.978 109.067C106.308 110.774 103.202 112.275 100.115 111.922C99.7404 111.883 99.3691 111.814 99.005 111.717C96.9771 111.191 95.2764 109.837 93.3383 109.06C89.4878 107.526 85.156 108.38 81.2798 109.766C77.4037 111.152 73.6494 113.039 69.5679 113.617C65.4863 114.194 60.8272 113.103 58.549 109.67C57.3169 107.796 56.9446 105.492 55.982 103.47C52.4652 96.1737 42.3512 94.3832 37.8846 87.6705C37.8076 87.555 37.7242 87.4331 37.6536 87.3111C36.9871 86.2307 36.4934 85.0528 36.1904 83.82C36.0987 83.4886 36.0258 83.1522 35.9722 82.8125C35.5499 80.3711 35.8051 77.8607 36.7102 75.5543L36.8257 75.2526C37.6704 73.3371 38.913 71.6231 40.4709 70.2246C42.0288 68.826 43.8663 67.7749 45.8616 67.1409C51.4384 65.3889 57.458 66.9291 63.3044 66.82C69.4267 66.7045 75.5554 64.76 81.5815 65.8125C86.2791 66.6275 90.566 69.2073 94.8657 71.3251C98.4403 73.0771 102.053 74.5339 105.994 74.4055C109.498 74.3093 112.841 72.9488 115.992 71.3957C121.768 68.5592 127.255 65.0167 133.319 62.7834C137.857 61.1085 142.894 60.2164 147.701 61.0699C152.797 62.0069 152.803 65.5943 152.681 69.894Z" fill="#6E71FF"/>
      <path d="M143.895 76.4463C142.554 78.025 140.481 78.7245 138.575 79.5331C130.059 83.159 128.146 94.0431 121.806 100.955C117.898 105.21 105.294 110.35 105.12 108.977C104.857 107.083 101.912 111.248 100.134 111.922C99.7592 111.883 99.3879 111.814 99.0238 111.717C96.9959 111.191 95.2952 109.837 93.3571 109.06C89.5066 107.526 85.1748 108.38 81.2986 109.766C77.4225 111.152 73.6682 113.039 69.5867 113.617C65.5051 114.194 60.846 113.103 58.5678 109.67C57.3356 107.796 56.9634 105.492 56.0008 103.47C53.6648 98.6124 48.4025 96.1994 43.8075 93.1447C41.486 91.7355 39.4717 89.8739 37.8842 87.6705C37.8072 87.555 37.7237 87.4331 37.6531 87.3111C36.9866 86.2307 36.493 85.0528 36.1899 83.82C37.6434 82.2477 39.4215 81.0105 41.401 80.1941C46.8045 77.9544 52.9525 78.9684 58.7282 78.3459C64.8185 77.7041 70.7547 75.2398 76.8513 75.7789C85.5278 76.5233 93.2673 83.2232 101.88 82.2285C105.371 81.8242 108.579 80.1749 111.583 78.378C117.108 75.0537 122.249 71.0492 128.082 68.2961C132.453 66.2424 137.394 64.8948 142.265 65.3504C143.298 65.4176 144.304 65.7112 145.211 66.2104C145.262 67.019 145.294 67.8597 145.371 68.7004C145.647 71.37 145.647 74.3734 143.895 76.4463Z" fill="url(#paint1_linear)"/>
      <path d="M126.721 94.9356C122.812 99.1904 111.421 106.712 106.903 110.19C105.389 111.364 101.904 111.249 100.12 111.923C99.7451 111.883 99.3739 111.815 99.0097 111.717C96.9818 111.191 95.2811 109.837 93.3431 109.061C89.4926 107.527 85.1607 108.38 81.2846 109.766C77.4084 111.153 73.6541 113.039 69.5726 113.617C65.4911 114.195 60.8319 113.104 58.5537 109.67C57.3216 107.796 56.9494 105.492 55.9867 103.471C53.6508 98.6128 48.3884 96.1999 43.7935 93.1451C44.176 92.8454 44.6371 92.6628 45.1211 92.6196C45.6051 92.5763 46.0913 92.6741 46.5209 92.9013C51.0517 95.9945 57.1804 94.9677 62.3465 93.1259C67.5126 91.284 72.6723 88.7235 78.14 89.0828C84.3008 89.4807 89.6273 93.5366 95.6534 94.9356C100.062 95.9408 104.678 95.4905 108.809 93.6521C111.062 92.651 121.041 83.1338 123.03 84.5842C123.762 85.1168 131.373 80.554 131.624 81.4267C131.816 82.1006 126.721 94.2554 126.721 94.9356Z" fill="url(#paint2_linear)"/>
      <path d="M198.56 38.9688C198.935 39.3692 199.184 39.8713 199.275 40.4123C199.366 40.9534 199.296 41.5093 199.073 42.0106C198.61 43.0018 197.956 43.8917 197.148 44.629C190.467 51.4765 181.399 57.7721 174.732 64.6131C171.24 68.2005 170.445 68.8936 166.748 72.2756C164.329 74.4897 161.813 76.6331 159.804 79.2258C157.975 81.6003 156.333 87.7354 154.985 90.4115L148.227 103.888C145.917 108.483 143.594 113.104 140.526 117.23C139.993 118.067 139.264 118.761 138.402 119.252C137.553 119.589 136.646 119.755 135.732 119.74C131.009 120.009 126.17 120.792 121.614 119.489C117.057 118.187 112.892 113.912 113.675 109.221C114.051 107.623 114.703 106.103 115.601 104.729L123.77 90.3217C126.234 85.9834 128.692 81.6452 131.24 77.3519C133.236 73.9955 135.341 70.6007 138.351 68.1107C141.008 65.9095 144.223 64.5297 147.393 63.1756C154.112 60.3006 160.87 57.7528 167.082 53.9023C173.393 49.976 179.98 46.5101 186.79 43.5316C190.649 41.8502 194.572 40.3293 198.56 38.9688Z" fill="white"/>
      <path d="M165.747 63.7011C166.581 62.9117 166.716 61.6539 167.236 60.6335C167.974 59.1831 169.443 58.2911 170.817 57.4247C176.169 53.9927 180.988 49.7937 185.121 44.9619C179.198 46.47 174.006 49.9547 168.949 53.3817L160.51 59.0933C157.16 61.3651 153.759 63.6754 151.179 66.7943C150.96 67.0229 150.807 67.3068 150.736 67.6157C150.627 68.3923 151.468 68.8992 152.09 69.387C154.734 71.447 156.692 72.6727 158.033 68.8479C158.591 67.2499 159.194 66.2809 160.78 65.4595C162.365 64.638 164.482 64.8947 165.747 63.7011Z" fill="url(#paint3_linear)" fill-opacity="0.3"/>
      <path d="M152.391 75.0928C153.239 75.3893 154.04 75.8041 154.772 76.3249C155.118 76.5818 155.492 76.7972 155.889 76.9667C156.086 77.0509 156.299 77.0943 156.514 77.0943C156.729 77.0943 156.942 77.0509 157.14 76.9667C157.223 76.9261 157.293 76.8612 157.339 76.7806C157.38 76.6665 157.38 76.5417 157.339 76.4276C156.834 74.9082 156.189 73.4388 155.414 72.0381C155.328 71.8619 155.21 71.7031 155.067 71.5696C154.827 71.4103 154.547 71.3214 154.258 71.3129C153.423 71.2236 152.58 71.243 151.749 71.3706C151.272 71.4232 150.824 71.6228 150.466 71.9418C150.209 72.2416 150.038 72.6053 149.972 72.9943C149.783 73.6552 149.737 74.3486 149.837 75.0286C150.235 75.0286 150.665 74.8553 151.088 74.8553C151.531 74.8729 151.97 74.9529 152.391 75.0928Z" fill="url(#paint4_linear)"/>
      <path d="M142.084 68.803C141.417 70.4321 141.079 72.1769 141.089 73.937C140.944 75.2206 141.114 76.5201 141.584 77.7234C141.618 77.8172 141.678 77.8995 141.757 77.9608C141.891 78.0229 142.043 78.0365 142.187 77.9993C142.99 77.8908 143.806 77.9344 144.593 78.1277C144.646 78.1366 144.696 78.1612 144.735 78.1983C144.774 78.2429 144.799 78.2991 144.805 78.3587L145.1 79.8861C146.23 85.6618 144.208 92.1949 139.504 95.7437C137.916 96.8124 136.219 97.7095 134.441 98.4198C131.348 99.851 128.319 101.629 126.04 104.138C123.762 106.647 122.286 110.106 122.716 113.495C126.999 111.322 130.795 108.303 133.876 104.619C136.064 101.994 137.9 99.0231 140.537 96.854C142.097 95.5705 143.92 94.5886 145.261 93.0741C147.828 90.1862 148.142 86.0148 148.335 82.1643C148.598 76.7736 148.482 70.5037 144.253 67.1602C143.823 67.4233 142.315 68.3089 142.084 68.803Z" fill="url(#paint5_linear)" fill-opacity="0.3"/>
      <path d="M204.437 32.031C205.618 31.6459 207.004 31.4919 208.018 32.2042C208.614 32.6715 209.06 33.3028 209.302 34.0204C209.943 35.6761 210.02 37.7233 208.891 39.1031C208.136 39.8934 207.209 40.4995 206.183 40.8743C204.092 41.9211 201.893 42.7346 199.624 43.3001C198.251 43.5953 196.159 43.6659 195.433 42.1321C194.792 40.7716 196.152 39.2699 196.897 38.2367C198.828 35.5799 201.248 33.0899 204.437 32.031Z" fill="url(#paint6_linear)"/>
      <path d="M109.855 81.3753C106.165 83.4289 102.385 85.7456 100.267 89.3908C98.2909 92.7921 98.0277 96.9121 98.0983 100.846C98.1265 105.185 98.6497 109.506 99.6578 113.726C99.7733 114.194 99.9658 114.727 100.421 114.875C100.763 114.937 101.115 114.871 101.41 114.689C102.862 113.974 104.142 112.953 105.162 111.697C106.182 110.441 106.918 108.979 107.32 107.411C107.596 106.288 107.699 105.133 107.904 104.003C108.443 101.499 109.237 99.0563 110.272 96.7132C110.631 95.6555 111.169 94.6677 111.864 93.7932C112.624 93.037 113.507 92.4162 114.476 91.9578C119.802 89.0442 125.18 86.2205 130.609 83.4867C132.633 82.5662 134.543 81.414 136.302 80.0533C138.073 78.6733 139.286 76.6995 139.716 74.4957C140.043 72.3202 141.686 67.4365 138.875 67.6162C136.064 67.7958 130.301 70.2473 127.766 71.3511C121.49 74.1107 115.811 78.0446 109.855 81.3753Z" fill="white"/>
      <path d="M140.294 71.5365C140.108 72.6339 139.826 73.7506 139.717 74.5271C139.283 76.7277 138.071 78.6983 136.303 80.0782C134.544 81.4389 132.634 82.5911 130.61 83.5116C125.19 86.2455 119.812 89.0692 114.477 91.9827C113.509 92.4428 112.626 93.0633 111.865 93.8181C111.164 94.6887 110.625 95.6776 110.273 96.7381C109.239 99.0816 108.445 101.524 107.905 104.028C107.7 105.158 107.597 106.313 107.315 107.436C106.908 109.001 106.171 110.46 105.153 111.716C104.134 112.971 102.858 113.993 101.411 114.714C101.117 114.898 100.763 114.962 100.422 114.893C99.9668 114.752 99.7807 114.213 99.6652 113.751C98.6534 109.523 98.128 105.193 98.0993 100.845C98.0223 96.905 98.2918 92.7978 100.268 89.3901C102.393 85.7385 106.173 83.4218 109.85 81.3746C115.831 78.0439 121.491 74.11 127.767 71.3761C130.334 70.2787 136.11 67.84 138.876 67.6347C140.692 67.5192 140.654 69.5086 140.294 71.5365Z" fill="white"/>
      <path d="M136.2 68.4886C137.675 69.954 139.281 71.2795 141.001 72.4482C142.729 73.6331 144.807 74.2006 146.898 74.059C147.264 74.0141 147.7 73.8857 147.79 73.5263C147.88 73.167 147.534 72.8268 147.238 72.5894C145.634 71.3059 144.331 69.4256 144.318 67.3655C144.318 66.3772 144.582 65.3184 144.094 64.4584C143.452 63.3867 142.015 63.2198 140.776 63.2776C139.536 63.3349 138.302 63.4894 137.086 63.7396C136.059 63.9514 127.78 67.6287 128.82 67.8854C128.993 67.9303 132.985 65.5173 136.2 68.4886Z" fill="#6E71FF"/>
      <path d="M136.508 65.7164C136.108 65.5856 135.729 65.3952 135.385 65.1517C135.214 65.0299 135.081 64.8622 135.002 64.668C134.922 64.4737 134.899 64.2609 134.936 64.0543C135.004 63.8308 135.13 63.6294 135.302 63.4703C136.534 62.1868 138.382 61.6926 140.14 61.3589C142.675 60.8776 145.467 60.6209 147.687 61.9301C147.97 62.0969 148.271 62.3601 148.22 62.6873C148.174 62.8688 148.067 63.0293 147.918 63.143C146.988 64.0158 145.878 64.6447 144.902 65.4597C143.927 66.2747 143.484 67.5967 142.553 68.4118C140.801 69.9455 138.234 66.4159 136.508 65.7164Z" fill="url(#paint7_linear)"/>
      <path d="M140.294 71.5371C140.108 72.6345 139.826 73.7511 139.717 74.5277C139.283 76.7282 138.071 78.6989 136.303 80.0788C134.544 81.4395 132.634 82.5917 130.61 83.5122C125.19 86.246 119.812 89.0697 114.477 91.9833C113.509 92.4434 112.626 93.0639 111.865 93.8187C111.164 94.6893 110.625 95.6782 110.273 96.7387C109.239 99.0822 108.445 101.525 107.905 104.029C107.7 105.158 107.597 106.314 107.315 107.437C106.9 109.094 106.105 110.632 104.992 111.929C104.591 109.146 104.377 106.34 104.35 103.528C104.279 99.5945 104.542 95.4744 106.519 92.0731C108.637 88.428 112.417 86.1113 116.107 84.0513C122.088 80.727 127.742 76.793 134.018 74.0656C135.436 73.4174 137.913 72.365 140.294 71.5371Z" fill="url(#paint8_linear)"/>
      <path d="M93.2871 121.567C94.1617 120.443 95.2766 119.529 96.5503 118.892C97.8239 118.254 99.224 117.91 100.648 117.884C101.961 117.697 103.3 117.823 104.556 118.249C105.505 118.646 106.315 119.314 106.886 120.169C107.457 121.024 107.762 122.028 107.765 123.056C107.779 123.764 107.553 124.457 107.123 125.02C106.909 125.299 106.616 125.509 106.283 125.623C105.95 125.738 105.59 125.751 105.249 125.662C105.149 125.636 105.056 125.586 104.979 125.517C104.902 125.448 104.843 125.361 104.807 125.264C104.778 125.15 104.778 125.031 104.807 124.917C105.022 123.936 104.953 122.915 104.608 121.972C104.432 121.501 104.144 121.079 103.77 120.744C103.395 120.409 102.945 120.169 102.458 120.046C101.572 119.977 100.681 120.053 99.8201 120.271C98.5366 120.662 96.3354 121.554 95.5846 122.639C94.8337 123.724 94.776 125.572 93.6272 126.387C92.8507 126.932 91.6057 127.305 91.0602 126.117C90.5147 124.93 92.5427 122.408 93.2871 121.567Z" fill="#3E3E54"/>
      <path d="M157.41 73.6609C157.475 73.9433 157.5 74.3027 157.269 74.4631C157.164 74.5246 157.044 74.557 156.923 74.557C156.801 74.557 156.681 74.5246 156.576 74.4631C155.498 73.969 154.741 72.8459 153.579 72.5956C152.868 72.5379 152.153 72.5379 151.442 72.5956C150.73 72.5571 149.915 72.1207 149.896 71.4084C149.896 70.85 150.345 70.4137 150.768 70.0479C151.526 69.4061 152.219 68.6809 152.95 68.0071C153.862 67.1728 154.035 67.1471 154.792 68.1739C156.017 69.813 156.907 71.6776 157.41 73.6609Z" fill="white"/>
      <path d="M146.488 73.2121C146.387 73.249 146.298 73.3135 146.231 73.3983C146.185 73.4892 146.167 73.5921 146.18 73.6935C146.25 74.4947 146.553 75.2579 147.053 75.8882C147.521 76.53 148.073 77.1204 148.503 77.8135C149.174 77.4865 149.745 76.984 150.154 76.3592C150.563 75.7345 150.795 75.0107 150.826 74.2646C150.852 73.9804 150.821 73.6939 150.735 73.4217C150.649 73.1496 150.51 72.8973 150.326 72.6795C149.35 71.6527 147.47 72.7372 146.488 73.2121Z" fill="#6E71FF"/>
      <path d="M146.923 85.0908C146.715 87.3384 145.767 89.4534 144.228 91.104C143.059 92.1885 141.675 93.015 140.165 93.5299C137.066 94.7171 133.748 95.2177 130.539 95.9878C127.33 96.7579 124.058 97.8424 121.516 99.9859C118.109 102.867 116.382 107.289 115.407 111.634L121.125 110.992C121.464 110.977 121.796 110.892 122.1 110.742C122.439 110.497 122.711 110.17 122.89 109.792C124.937 106.294 127.555 103.047 130.944 100.807C134.082 98.7537 137.74 97.6563 141.096 95.9942C144.452 94.332 147.712 91.8356 148.829 88.2547C149.21 86.8862 149.4 85.4717 149.394 84.0512C149.445 82.1709 149.394 80.2841 149.285 78.4038C149.285 77.1124 148.986 75.8385 148.412 74.6816C147.655 76.2989 146.724 77.6594 146.897 79.4563C147.111 81.3279 147.12 83.2173 146.923 85.0908Z" fill="#6E71FF"/>
      <path d="M101.693 110.966C100.874 111.543 100.253 112.359 99.9157 113.302C98.9724 115.298 97.9905 117.461 98.3499 119.643C98.4229 120.226 98.6611 120.776 99.0365 121.228C99.3384 121.517 99.7023 121.733 100.1 121.86C100.499 121.987 100.921 122.021 101.334 121.959C102.159 121.829 102.954 121.553 103.683 121.144C105.082 120.445 106.545 119.534 107.058 118.058C107.495 116.774 107.123 115.401 106.757 114.111C106.513 113.27 106.115 110.799 105.3 110.35C104.633 110.004 102.335 110.613 101.693 110.966Z" fill="url(#paint9_linear)"/>
      <path d="M115.696 123.152C116.187 123.109 116.681 123.17 117.146 123.332C117.578 123.548 117.944 123.876 118.205 124.282C119.21 125.795 119.663 127.608 119.489 129.416C119.305 131.208 118.918 132.974 118.333 134.678L114.483 147.513C114.2 148.794 113.62 149.99 112.789 151.004C111.332 152.519 109.009 152.699 106.91 152.75C98.1697 152.975 89.4226 152.59 80.6948 152.108C78.6213 152.099 76.5629 151.757 74.5981 151.094C73.443 150.632 72.3007 149.811 71.967 148.643C71.8385 148.074 71.819 147.486 71.9092 146.91C72.1436 145.134 72.4909 143.374 72.9488 141.641C73.9243 137.618 74.9126 133.555 76.6838 129.807C77.1952 128.564 77.978 127.45 78.9749 126.547C79.6122 126.048 80.3249 125.654 81.0862 125.379C84.7442 123.974 88.6461 124.872 92.4517 124.507C97.4402 124.027 102.433 123.674 107.43 123.448C110.173 123.298 112.928 123.2 115.696 123.152Z" fill="#3E3E54"/>
      <path d="M114.76 123.268C115.251 123.227 115.745 123.288 116.21 123.448C116.644 123.664 117.012 123.992 117.276 124.398C118.277 125.913 118.73 127.724 118.559 129.532C118.373 131.325 117.984 133.09 117.398 134.794L113.547 147.629C113.265 148.91 112.684 150.106 111.853 151.121C110.396 152.635 108.073 152.815 105.974 152.872C97.2337 153.091 88.4931 152.706 79.7589 152.231C77.6855 152.222 75.627 151.879 73.6623 151.217C72.5135 150.755 71.3648 149.933 71.0311 148.765C70.9048 148.196 70.8874 147.608 70.9797 147.033C71.2126 145.256 71.5577 143.496 72.0129 141.764C72.9884 137.74 73.9767 133.678 75.7479 129.93C76.2608 128.687 77.0434 127.573 78.039 126.67C78.675 126.17 79.3881 125.778 80.1503 125.508C83.8083 124.096 87.7102 124.995 91.5222 124.629C96.5021 124.15 101.493 123.797 106.494 123.57C109.237 123.425 111.992 123.324 114.76 123.268Z" fill="url(#paint10_linear)"/>
      <path d="M151.025 58.1758C151.23 57.9542 151.385 57.6917 151.481 57.4057C151.535 57.1346 151.535 56.8553 151.481 56.5842C151.198 54.8451 150.627 53.1252 150.743 51.3604C150.895 49.4735 151.758 47.7146 153.156 46.4382C154.553 45.1829 156.303 44.3895 158.168 44.1664C159.376 43.9513 160.622 44.1503 161.704 44.7311C163.129 45.6103 163.783 47.2981 164.162 48.941C164.54 50.5839 164.771 52.2909 165.689 53.6835C165.939 54.0622 166.26 54.4985 166.126 54.967C166.041 55.1602 165.929 55.3397 165.792 55.4997C164.816 56.9244 165.978 59.1063 164.983 60.5182C164.731 60.8477 164.409 61.1173 164.04 61.3075C162.461 62.1675 160.542 62.0455 158.829 62.591C157.191 63.186 155.743 64.2074 154.632 65.5495C153.477 66.833 152.527 68.3026 151.481 69.6824C151.08 70.3565 150.483 70.8922 149.77 71.2179C149.057 71.5436 148.261 71.6438 147.489 71.5049C147.239 71.5521 146.981 71.5491 146.732 71.496C146.483 71.4429 146.247 71.3409 146.037 71.1959C145.827 71.0508 145.649 70.8656 145.511 70.6509C145.374 70.4363 145.281 70.1965 145.237 69.9455C144.853 68.9954 144.623 67.9902 144.556 66.9678C144.505 64.9463 145.699 64.2532 146.918 62.9247C148.347 61.376 149.716 59.793 151.025 58.1758Z" fill="url(#paint11_linear)"/>
      <path d="M160.266 41.1692C158.915 40.5004 157.381 40.2952 155.902 40.5852C155.01 40.6778 154.142 40.9254 153.335 41.3168C151.063 42.4848 149.914 45.1224 147.771 46.5086C146.995 47.0156 146.083 47.3557 145.474 48.0488C145.179 48.3795 144.968 48.7753 144.856 49.2037C144.745 49.6321 144.736 50.0809 144.832 50.5131C144.962 50.848 145.019 51.2069 144.999 51.5656C144.867 51.9435 144.647 52.2845 144.357 52.5603C143.99 53.0409 143.783 53.6242 143.765 54.2284C143.746 54.8327 143.917 55.4276 144.254 55.9295C145.14 57.213 146.892 57.5403 147.931 58.6698C148.464 59.2474 148.894 60.0688 149.677 60.1651C150.22 60.1631 150.74 59.9489 151.127 59.5683C152.199 58.7211 153.187 57.5724 153.271 56.2055C153.271 55.737 153.213 55.2621 153.271 54.7936C153.274 54.5576 153.337 54.3262 153.455 54.1217C153.573 53.9172 153.742 53.7464 153.945 53.6256C154.202 53.5396 154.479 53.5296 154.742 53.5967C155.005 53.6639 155.243 53.8054 155.427 54.0043C155.825 54.3701 156.107 54.845 156.499 55.2172C156.527 55.253 156.569 55.2761 156.614 55.2814C156.636 55.2799 156.658 55.274 156.678 55.2641C156.698 55.2542 156.715 55.2404 156.73 55.2236C156.926 54.9915 157.053 54.7098 157.099 54.4096C157.144 54.1094 157.105 53.8025 156.987 53.523C156.74 52.967 156.572 52.3795 156.486 51.7774C156.507 51.3789 156.613 50.9895 156.797 50.6353C156.98 50.2811 157.238 49.9703 157.551 49.7238C158.148 49.1976 158.835 48.7997 159.477 48.2798C160.478 47.4199 161.748 45.8348 162.044 44.5128C162.339 43.1908 161.376 41.811 160.266 41.1692Z" fill="#3E3E54"/>
      <path d="M147.424 70.4973C147.912 70.9722 148.522 71.6332 148.175 72.2236C147.829 72.814 147.116 72.6536 146.52 72.5958C146.056 72.5308 145.584 72.5622 145.134 72.6881C144.683 72.814 144.264 73.0317 143.901 73.3274C142.983 74.1874 142.797 75.7148 141.706 76.3501C141.197 73.2247 141.214 70.036 141.758 66.9163C141.829 66.4451 141.949 65.9827 142.117 65.5366C142.491 64.7751 142.995 64.0846 143.606 63.4958C144.022 63.1818 144.521 62.9948 145.041 62.9572C145.561 62.9197 146.081 63.0331 146.539 63.284C146.539 63.284 145.101 65.4147 145.185 66.0821C145.419 67.7621 146.207 69.316 147.424 70.4973Z" fill="white"/>
      <path d="M95.9173 74.0202C95.9173 75.6246 93.9022 76.5423 92.3235 76.2279C90.7447 75.9134 89.4356 74.8674 87.9916 74.1743C83.2427 71.9025 77.6723 73.7315 72.4163 73.7828C65.9988 73.8534 59.7225 71.1709 53.2793 71.2864C48.7721 71.3784 44.3974 72.8277 40.7267 75.4449C40.3382 75.6658 39.9765 75.9307 39.6485 76.2343C39.4753 76.4268 37.7233 79.6997 35.9649 82.8058C35.5425 80.3645 35.7978 77.854 36.7029 75.5476L36.8184 75.246C37.6646 73.331 38.9084 71.6178 40.4674 70.2204C42.0264 68.8229 43.8649 67.7731 45.8607 67.1407C51.4375 65.3887 57.4571 66.9289 63.3035 66.8198C69.4258 66.7043 75.5545 64.7598 81.5805 65.8122C86.2782 66.6273 90.5651 69.2071 94.8648 71.3249C95.0958 71.7292 95.3012 72.1399 95.5065 72.5571C95.7492 73.0087 95.8895 73.5083 95.9173 74.0202Z" fill="url(#paint12_linear)"/>
      <defs>
      <linearGradient id="paint0_linear" x1="152.353" y1="67.1621" x2="84.9135" y2="61.6316" gradientUnits="userSpaceOnUse">
      <stop offset="0.079127"/>
      <stop offset="0.83" stop-opacity="0.07"/>
      <stop offset="1" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="paint1_linear" x1="53.4971" y1="30.1008" x2="205.62" y2="45.0359" gradientUnits="userSpaceOnUse">
      <stop stop-opacity="0"/>
      <stop offset="0.87783" stop-opacity="0.75"/>
      <stop offset="1"/>
      </linearGradient>
      <linearGradient id="paint2_linear" x1="97.5715" y1="117.296" x2="98.3532" y2="53.289" gradientUnits="userSpaceOnUse">
      <stop stop-opacity="0"/>
      <stop offset="0.639117" stop-opacity="0.75"/>
      <stop offset="1"/>
      </linearGradient>
      <linearGradient id="paint3_linear" x1="168.424" y1="22.6821" x2="136.904" y2="90.8093" gradientUnits="userSpaceOnUse">
      <stop offset="0.01" stop-opacity="0.53"/>
      <stop offset="0.83" stop-opacity="0.07"/>
      <stop offset="1" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="paint4_linear" x1="153.36" y1="76.1196" x2="156.338" y2="63.8429" gradientUnits="userSpaceOnUse">
      <stop stop-opacity="0"/>
      <stop offset="0.72" stop-opacity="0.51"/>
      <stop offset="0.99"/>
      </linearGradient>
      <linearGradient id="paint5_linear" x1="135.905" y1="28.0122" x2="63.479" y2="94.7798" gradientUnits="userSpaceOnUse">
      <stop offset="0.01" stop-opacity="0.53"/>
      <stop offset="0.83" stop-opacity="0.07"/>
      <stop offset="1" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="paint6_linear" x1="195.266" y1="37.5885" x2="209.776" y2="37.5885" gradientUnits="userSpaceOnUse">
      <stop stop-color="#E5C5D5"/>
      <stop offset="0.42" stop-color="#EAD4D1"/>
      <stop offset="1" stop-color="#F0E9CB"/>
      </linearGradient>
      <linearGradient id="paint7_linear" x1="3796.59" y1="830.374" x2="4001.11" y2="1049.5" gradientUnits="userSpaceOnUse">
      <stop stop-opacity="0"/>
      <stop offset="0.99"/>
      </linearGradient>
      <linearGradient id="paint8_linear" x1="9257.62" y1="5171.81" x2="9092.5" y2="9467.78" gradientUnits="userSpaceOnUse">
      <stop stop-opacity="0"/>
      <stop offset="0.99"/>
      </linearGradient>
      <linearGradient id="paint9_linear" x1="98.2741" y1="116.119" x2="107.262" y2="116.119" gradientUnits="userSpaceOnUse">
      <stop stop-color="#E5C5D5"/>
      <stop offset="0.42" stop-color="#EAD4D1"/>
      <stop offset="1" stop-color="#F0E9CB"/>
      </linearGradient>
      <linearGradient id="paint10_linear" x1="125.68" y1="104.515" x2="65.0479" y2="92.2278" gradientUnits="userSpaceOnUse">
      <stop offset="0.079127"/>
      <stop offset="0.83" stop-opacity="0.07"/>
      <stop offset="1" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="paint11_linear" x1="144.555" y1="57.8258" x2="166.172" y2="57.8258" gradientUnits="userSpaceOnUse">
      <stop stop-color="#E5C5D5"/>
      <stop offset="0.42" stop-color="#EAD4D1"/>
      <stop offset="1" stop-color="#F0E9CB"/>
      </linearGradient>
      <linearGradient id="paint12_linear" x1="64.6768" y1="74.6684" x2="59.331" y2="59.6771" gradientUnits="userSpaceOnUse">
      <stop offset="0.02" stop-color="white" stop-opacity="0"/>
      <stop offset="1" stop-color="white"/>
      </linearGradient>
      </defs>
      </svg>`
      },
      bundleFormIds: [],
      hasOtherOffers: false,
      otherOffersTitle: ''
    };
  }
  getFormCompletedPage(
    formId?: any,
    formType: any = 'undefined',
    companyId?: string
  ): Observable<FormCompletedPageResponse> {
    const cId = companyId ? `?companyId=${companyId}` : '';
    const params = `${formType}/${formId}`;
    return this.http
      .get(`${NEW_CLIENT_URL}/page/thank-you/${params + cId}`)
      .pipe(
        map((result: { obj: FormCompletedPageResponse }) => {
          if (!result.obj) {
            return this.defaultPage(companyId);
          }
          return result.obj;
        })
      );
  }
}
