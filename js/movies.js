/* Verified local snapshot. Sources and runtime differences: docs/sources.md. */
(() => {
  'use strict';
  const movies = [
  {
    "id": "interstellar",
    "title": "Interstellar",
    "originalTitle": "Interstellar",
    "year": 2014,
    "runtime": 168,
    "genres": [
      "Khoa học viễn tưởng",
      "Phiêu lưu",
      "Chính kịch"
    ],
    "countries": [
      "Vương quốc Anh",
      "Hoa Kỳ"
    ],
    "director": "Christopher Nolan",
    "cast": [
      "Matthew McConaughey",
      "Anne Hathaway",
      "Jessica Chastain"
    ],
    "summary": "Khi Trái Đất dần không còn thích hợp cho sự sống, cựu phi công Cooper tham gia chuyến thám hiểm xuyên thiên hà để tìm một mái nhà mới cho nhân loại. Hành trình đưa anh rời xa gia đình và đối diện những giới hạn của thời gian.",
    "studio": "Paramount Pictures",
    "poster": "images/posters/interstellar.jpg",
    "backdrop": null,
    "images": {
      "posterSource": "https://public-website-assets.paramountpictures.com/paramount2025/s3fs-public/styles/poster_medium/public/intersteller_en_dvd_800x1200.jpg?itok=YxrRaJN2",
      "backdropSource": null,
      "page": "https://www.paramount.com/movies/interstellar",
      "checkedAt": "2026-10-22"
    },
    "sources": {
      "info": "https://www.paramount.com/movies/interstellar",
      "countries": "https://letterboxd.com/film/interstellar/",
      "runtime": "https://www.paramount.com/movies/interstellar",
      "checkedAt": "2026-10-22"
    },
    "ratings": [
      {
        "source": "Metacritic",
        "label": "Metascore",
        "group": "critics",
        "metric": "rating",
        "value": 74,
        "scale": 100,
        "url": "https://www.metacritic.com/movie/interstellar/",
        "checkedAt": "2026-10-22",
        "status": "verified"
      },
      {
        "source": "Metacritic",
        "label": "User Score",
        "group": "audience",
        "metric": "rating",
        "value": 8.7,
        "scale": 10,
        "url": "https://www.metacritic.com/movie/interstellar/",
        "checkedAt": "2026-10-22",
        "status": "verified"
      }
    ]
  },
  {
    "id": "arrival",
    "title": "Arrival",
    "originalTitle": "Arrival",
    "year": 2016,
    "runtime": 116,
    "genres": [
      "Khoa học viễn tưởng",
      "Giật gân",
      "Chính kịch"
    ],
    "countries": [
      "Hoa Kỳ"
    ],
    "director": "Denis Villeneuve",
    "cast": [
      "Amy Adams",
      "Jeremy Renner",
      "Forest Whitaker"
    ],
    "summary": "Những phi thuyền bí ẩn xuất hiện khắp thế giới. Nhà ngôn ngữ học Louise Banks được giao nhiệm vụ tìm cách giao tiếp với các vị khách ngoài hành tinh, trong lúc sự hoài nghi giữa con người có thể đẩy tất cả tới chiến tranh.",
    "studio": "Paramount Pictures",
    "poster": "images/posters/arrival.jpg",
    "backdrop": null,
    "images": {
      "posterSource": "https://public-website-assets.paramountpictures.com/paramount2025/s3fs-public/styles/poster_medium/public/arrival_dom_2016_dvd_en_800x1200.jpg?itok=dX0Ilggj",
      "backdropSource": null,
      "page": "https://www.paramount.com/movies/arrival",
      "checkedAt": "2026-10-22"
    },
    "sources": {
      "info": "https://www.paramount.com/movies/arrival",
      "countries": "https://letterboxd.com/film/arrival-2016/",
      "runtime": "https://www.paramount.com/movies/arrival",
      "checkedAt": "2026-10-22"
    },
    "ratings": [
      {
        "source": "Metacritic",
        "label": "Metascore",
        "group": "critics",
        "metric": "rating",
        "value": 81,
        "scale": 100,
        "url": "https://www.metacritic.com/movie/arrival/",
        "checkedAt": "2026-10-22",
        "status": "verified"
      },
      {
        "source": "Metacritic",
        "label": "User Score",
        "group": "audience",
        "metric": "rating",
        "value": 8.2,
        "scale": 10,
        "url": "https://www.metacritic.com/movie/arrival/",
        "checkedAt": "2026-10-22",
        "status": "verified"
      }
    ]
  },
  {
    "id": "top-gun-maverick",
    "title": "Top Gun: Maverick",
    "originalTitle": "Top Gun: Maverick",
    "year": 2022,
    "runtime": 131,
    "genres": [
      "Hành động",
      "Phiêu lưu"
    ],
    "countries": [
      "Hoa Kỳ"
    ],
    "director": "Joseph Kosinski",
    "cast": [
      "Tom Cruise",
      "Miles Teller",
      "Jennifer Connelly"
    ],
    "summary": "Sau hơn ba mươi năm phục vụ, Pete “Maverick” Mitchell trở lại TOP GUN để huấn luyện một nhóm phi công tinh nhuệ cho nhiệm vụ đặc biệt. Sự xuất hiện của con trai người đồng đội cũ buộc anh đối mặt với những mất mát chưa nguôi.",
    "studio": "Paramount Pictures",
    "poster": "images/posters/top-gun-maverick.jpg",
    "backdrop": "images/backdrops/top-gun-maverick.jpg",
    "images": {
      "posterSource": "https://public-website-assets.paramountpictures.com/paramount2025/s3fs-public/styles/poster_medium/public/topgunmaverick-en-800x1200-c.jpg?itok=R5l9EIQ4",
      "backdropSource": "https://public-website-assets.paramountpictures.com/paramount2025/s3fs-public/styles/hero_full/public/tgm1800x600-c.jpg?itok=5-zx9kLf",
      "page": "https://www.paramount.com/movies/top-gun-maverick",
      "checkedAt": "2026-10-22"
    },
    "sources": {
      "info": "https://www.paramount.com/movies/top-gun-maverick",
      "countries": "https://letterboxd.com/film/top-gun-maverick/",
      "runtime": "https://www.paramount.com/movies/top-gun-maverick",
      "checkedAt": "2026-10-22"
    },
    "ratings": [
      {
        "source": "Metacritic",
        "label": "Metascore",
        "group": "critics",
        "metric": "rating",
        "value": 78,
        "scale": 100,
        "url": "https://www.metacritic.com/movie/top-gun-maverick/",
        "checkedAt": "2026-10-22",
        "status": "verified"
      },
      {
        "source": "Metacritic",
        "label": "User Score",
        "group": "audience",
        "metric": "rating",
        "value": 8.4,
        "scale": 10,
        "url": "https://www.metacritic.com/movie/top-gun-maverick/",
        "checkedAt": "2026-10-22",
        "status": "verified"
      }
    ]
  },
  {
    "id": "the-godfather",
    "title": "The Godfather",
    "originalTitle": "The Godfather",
    "year": 1972,
    "runtime": 175,
    "genres": [
      "Tội phạm",
      "Chính kịch"
    ],
    "countries": [
      "Hoa Kỳ"
    ],
    "director": "Francis Ford Coppola",
    "cast": [
      "Marlon Brando",
      "Al Pacino",
      "James Caan"
    ],
    "summary": "Gia đình Corleone đứng trước những biến động trong thế giới tội phạm có tổ chức. Michael, người con từng muốn đứng ngoài công việc của cha, dần bị cuốn vào cuộc đấu tranh vì quyền lực và sự tồn tại của gia đình.",
    "studio": "Paramount Pictures",
    "poster": "images/posters/the-godfather.jpg",
    "backdrop": null,
    "images": {
      "posterSource": "https://public-website-assets.paramountpictures.com/paramount2025/s3fs-public/styles/poster_medium/public/godfather_2017update_en_800x1200.jpg?itok=y_FtUZwz",
      "backdropSource": null,
      "page": "https://www.paramount.com/movies/the-godfather",
      "checkedAt": "2026-10-22"
    },
    "sources": {
      "info": "https://www.paramount.com/movies/the-godfather",
      "countries": "https://letterboxd.com/film/the-godfather/",
      "runtime": "https://www.paramount.com/movies/the-godfather",
      "checkedAt": "2026-10-22"
    },
    "ratings": [
      {
        "source": "Metacritic",
        "label": "Metascore",
        "group": "critics",
        "metric": "rating",
        "value": 100,
        "scale": 100,
        "url": "https://www.metacritic.com/movie/the-godfather/",
        "checkedAt": "2026-10-22",
        "status": "verified"
      },
      {
        "source": "Metacritic",
        "label": "User Score",
        "group": "audience",
        "metric": "rating",
        "value": 9.2,
        "scale": 10,
        "url": "https://www.metacritic.com/movie/the-godfather/",
        "checkedAt": "2026-10-22",
        "status": "verified"
      }
    ]
  },
  {
    "id": "the-truman-show",
    "title": "The Truman Show",
    "originalTitle": "The Truman Show",
    "year": 1998,
    "runtime": 104,
    "genres": [
      "Hài",
      "Chính kịch"
    ],
    "countries": [
      "Hoa Kỳ"
    ],
    "director": "Peter Weir",
    "cast": [
      "Jim Carrey",
      "Laura Linney",
      "Ed Harris"
    ],
    "summary": "Truman Burbank sống một cuộc đời tưởng chừng bình yên ở thị trấn ven biển. Những chi tiết bất thường khiến anh bắt đầu nghi ngờ thế giới quanh mình, mà không biết cuộc sống của anh đang là một chương trình truyền hình khổng lồ.",
    "studio": "Paramount Pictures",
    "poster": "images/posters/the-truman-show.jpg",
    "backdrop": null,
    "images": {
      "posterSource": "https://public-website-assets.paramountpictures.com/paramount2025/s3fs-public/styles/poster_medium/public/trumanshow-pm-800x1200-c.jpg?itok=7bY2Yco6",
      "backdropSource": null,
      "page": "https://www.paramount.com/movies/the-truman-show",
      "checkedAt": "2026-10-22"
    },
    "sources": {
      "info": "https://www.paramount.com/movies/the-truman-show",
      "countries": "https://letterboxd.com/film/the-truman-show/",
      "runtime": "https://www.paramount.com/movies/the-truman-show",
      "checkedAt": "2026-10-22"
    },
    "ratings": [
      {
        "source": "Metacritic",
        "label": "Metascore",
        "group": "critics",
        "metric": "rating",
        "value": 90,
        "scale": 100,
        "url": "https://www.metacritic.com/movie/the-truman-show/",
        "checkedAt": "2026-10-22",
        "status": "verified"
      },
      {
        "source": "Metacritic",
        "label": "User Score",
        "group": "audience",
        "metric": "rating",
        "value": 8.7,
        "scale": 10,
        "url": "https://www.metacritic.com/movie/the-truman-show/",
        "checkedAt": "2026-10-22",
        "status": "verified"
      }
    ]
  },
  {
    "id": "forrest-gump",
    "title": "Forrest Gump",
    "originalTitle": "Forrest Gump",
    "year": 1994,
    "runtime": 142,
    "genres": [
      "Hài",
      "Chính kịch"
    ],
    "countries": [
      "Hoa Kỳ"
    ],
    "director": "Robert Zemeckis",
    "cast": [
      "Tom Hanks",
      "Robin Wright",
      "Gary Sinise"
    ],
    "summary": "Với sự chân thành và cách nhìn đời giản dị, Forrest Gump đi qua những biến động lớn của nước Mỹ. Giữa các cuộc gặp gỡ và hành trình bất ngờ, tình yêu dành cho Jenny vẫn là điều luôn ở lại trong anh.",
    "studio": "Paramount Pictures",
    "poster": "images/posters/forrest-gump.jpg",
    "backdrop": null,
    "images": {
      "posterSource": "https://public-website-assets.paramountpictures.com/paramount2025/s3fs-public/styles/poster_medium/public/forrestgump_2019update_en_800x1200.jpg?itok=wqyuMS2H",
      "backdropSource": null,
      "page": "https://www.paramount.com/movies/forrest-gump",
      "checkedAt": "2026-10-22"
    },
    "sources": {
      "info": "https://www.paramount.com/movies/forrest-gump",
      "countries": "https://letterboxd.com/film/forrest-gump/",
      "runtime": "https://www.paramount.com/movies/forrest-gump",
      "checkedAt": "2026-10-22"
    },
    "ratings": [
      {
        "source": "Metacritic",
        "label": "Metascore",
        "group": "critics",
        "metric": "rating",
        "value": 82,
        "scale": 100,
        "url": "https://www.metacritic.com/movie/forrest-gump/",
        "checkedAt": "2026-10-22",
        "status": "verified"
      },
      {
        "source": "Metacritic",
        "label": "User Score",
        "group": "audience",
        "metric": "rating",
        "value": 8.9,
        "scale": 10,
        "url": "https://www.metacritic.com/movie/forrest-gump/",
        "checkedAt": "2026-10-22",
        "status": "verified"
      }
    ]
  },
  {
    "id": "shutter-island",
    "title": "Shutter Island",
    "originalTitle": "Shutter Island",
    "year": 2010,
    "runtime": 138,
    "genres": [
      "Bí ẩn",
      "Giật gân",
      "Chính kịch"
    ],
    "countries": [
      "Hoa Kỳ"
    ],
    "director": "Martin Scorsese",
    "cast": [
      "Leonardo DiCaprio",
      "Mark Ruffalo",
      "Ben Kingsley"
    ],
    "summary": "Cảnh sát liên bang Teddy Daniels tới một bệnh viện tâm thần trên đảo để điều tra vụ mất tích của bệnh nhân. Cuộc tìm kiếm ngày càng bất an khi những bí mật của hòn đảo va chạm với ký ức và nỗi ám ảnh của chính anh.",
    "studio": "Paramount Pictures",
    "poster": "images/posters/shutter-island.jpg",
    "backdrop": null,
    "images": {
      "posterSource": "https://public-website-assets.paramountpictures.com/paramount2025/s3fs-public/styles/poster_medium/public/shutterisland_en_800x1200.jpg?itok=lGxrF_ps",
      "backdropSource": null,
      "page": "https://www.paramount.com/movies/shutter-island",
      "checkedAt": "2026-10-22"
    },
    "sources": {
      "info": "https://www.paramount.com/movies/shutter-island",
      "countries": "https://letterboxd.com/film/shutter-island/",
      "runtime": "https://www.paramount.com/movies/shutter-island",
      "checkedAt": "2026-10-22"
    },
    "ratings": [
      {
        "source": "Metacritic",
        "label": "Metascore",
        "group": "critics",
        "metric": "rating",
        "value": 63,
        "scale": 100,
        "url": "https://www.metacritic.com/movie/shutter-island/",
        "checkedAt": "2026-10-22",
        "status": "verified"
      },
      {
        "source": "Metacritic",
        "label": "User Score",
        "group": "audience",
        "metric": "rating",
        "value": 8.3,
        "scale": 10,
        "url": "https://www.metacritic.com/movie/shutter-island/",
        "checkedAt": "2026-10-22",
        "status": "verified"
      }
    ]
  },
  {
    "id": "gladiator",
    "title": "Gladiator",
    "originalTitle": "Gladiator",
    "year": 2000,
    "runtime": 155,
    "genres": [
      "Hành động",
      "Phiêu lưu",
      "Chính kịch"
    ],
    "countries": [
      "Vương quốc Anh",
      "Hoa Kỳ"
    ],
    "director": "Ridley Scott",
    "cast": [
      "Russell Crowe",
      "Joaquin Phoenix",
      "Connie Nielsen"
    ],
    "summary": "Vị tướng La Mã Maximus mất gia đình và bị đẩy vào kiếp nô lệ sau một cuộc tranh đoạt quyền lực. Trở thành đấu sĩ, anh tìm đường trở lại Rome để đối mặt với hoàng đế Commodus.",
    "studio": "Paramount Pictures",
    "poster": "images/posters/gladiator.jpg",
    "backdrop": null,
    "images": {
      "posterSource": "https://public-website-assets.paramountpictures.com/paramount2025/s3fs-public/styles/poster_medium/public/gladiator_en_800x1200.jpg?itok=C9HGLNj9",
      "backdropSource": null,
      "page": "https://www.paramount.com/movies/gladiator",
      "checkedAt": "2026-10-22"
    },
    "sources": {
      "info": "https://www.paramount.com/movies/gladiator",
      "countries": "https://letterboxd.com/film/gladiator-2000/",
      "runtime": "https://www.paramount.com/movies/gladiator",
      "checkedAt": "2026-10-22"
    },
    "ratings": [
      {
        "source": "Metacritic",
        "label": "Metascore",
        "group": "critics",
        "metric": "rating",
        "value": 67,
        "scale": 100,
        "url": "https://www.metacritic.com/movie/gladiator/",
        "checkedAt": "2026-10-22",
        "status": "verified"
      },
      {
        "source": "Metacritic",
        "label": "User Score",
        "group": "audience",
        "metric": "rating",
        "value": 8.7,
        "scale": 10,
        "url": "https://www.metacritic.com/movie/gladiator/",
        "checkedAt": "2026-10-22",
        "status": "verified"
      }
    ]
  },
  {
    "id": "a-quiet-place",
    "title": "A Quiet Place",
    "originalTitle": "A Quiet Place",
    "year": 2018,
    "runtime": 90,
    "genres": [
      "Kinh dị",
      "Giật gân"
    ],
    "countries": [
      "Hoa Kỳ"
    ],
    "director": "John Krasinski",
    "cast": [
      "Emily Blunt",
      "John Krasinski",
      "Millicent Simmonds"
    ],
    "summary": "Trong thế giới bị những sinh vật săn mồi bằng âm thanh chiếm lĩnh, gia đình Abbott buộc phải sống trong im lặng. Mỗi bước chân và tiếng động đều có thể đặt họ vào hiểm nguy khi tìm cách bảo vệ nhau.",
    "studio": "Paramount Pictures",
    "poster": "images/posters/a-quiet-place.jpg",
    "backdrop": null,
    "images": {
      "posterSource": "https://public-website-assets.paramountpictures.com/paramount2025/s3fs-public/styles/poster_medium/public/aquietplace_2018_dvd_en_800x1200.jpg?itok=ikfLyVpF",
      "backdropSource": null,
      "page": "https://www.paramount.com/movies/a-quiet-place",
      "checkedAt": "2026-10-22"
    },
    "sources": {
      "info": "https://www.paramount.com/movies/a-quiet-place",
      "countries": "https://letterboxd.com/film/a-quiet-place-2018/",
      "runtime": "https://www.paramount.com/movies/a-quiet-place",
      "checkedAt": "2026-10-22"
    },
    "ratings": [
      {
        "source": "Metacritic",
        "label": "Metascore",
        "group": "critics",
        "metric": "rating",
        "value": 82,
        "scale": 100,
        "url": "https://www.metacritic.com/movie/a-quiet-place/",
        "checkedAt": "2026-10-22",
        "status": "verified"
      },
      {
        "source": "Metacritic",
        "label": "User Score",
        "group": "audience",
        "metric": "rating",
        "value": 7.4,
        "scale": 10,
        "url": "https://www.metacritic.com/movie/a-quiet-place/",
        "checkedAt": "2026-10-22",
        "status": "verified"
      }
    ]
  },
  {
    "id": "the-godfather-part-ii",
    "title": "The Godfather Part II",
    "originalTitle": "The Godfather Part II",
    "year": 1974,
    "runtime": 200,
    "genres": [
      "Tội phạm",
      "Chính kịch"
    ],
    "countries": [
      "Hoa Kỳ"
    ],
    "director": "Francis Ford Coppola",
    "cast": [
      "Al Pacino",
      "Robert De Niro",
      "Robert Duvall"
    ],
    "summary": "Hai thế hệ gia đình Corleone được kể song song: hành trình gây dựng sự nghiệp của Vito thời trẻ và cuộc củng cố quyền lực của Michael. Càng đi sâu vào đế chế gia đình, Michael càng phải trả giá trong các mối quan hệ gần gũi nhất.",
    "studio": "Paramount Pictures",
    "poster": "images/posters/the-godfather-part-ii.jpg",
    "backdrop": null,
    "images": {
      "posterSource": "https://public-website-assets.paramountpictures.com/paramount2025/s3fs-public/styles/poster_medium/public/godfatherpart2_2017update_en_800x1200.jpg?itok=rTYa1BUj",
      "backdropSource": null,
      "page": "https://www.paramount.com/movies/the-godfather-part-ii",
      "checkedAt": "2026-10-22"
    },
    "sources": {
      "info": "https://www.paramount.com/movies/the-godfather-part-ii",
      "countries": "https://letterboxd.com/film/the-godfather-part-ii/",
      "runtime": "https://www.paramount.com/movies/the-godfather-part-ii",
      "checkedAt": "2026-10-22"
    },
    "ratings": [
      {
        "source": "Metacritic",
        "label": "Metascore",
        "group": "critics",
        "metric": "rating",
        "value": 90,
        "scale": 100,
        "url": "https://www.metacritic.com/movie/the-godfather-part-ii/",
        "checkedAt": "2026-10-22",
        "status": "verified"
      },
      {
        "source": "Metacritic",
        "label": "User Score",
        "group": "audience",
        "metric": "rating",
        "value": 9.1,
        "scale": 10,
        "url": "https://www.metacritic.com/movie/the-godfather-part-ii/",
        "checkedAt": "2026-10-22",
        "status": "verified"
      }
    ]
  },
  {
    "id": "titanic",
    "title": "Titanic",
    "originalTitle": "Titanic",
    "year": 1997,
    "runtime": 196,
    "genres": [
      "Lãng mạn",
      "Chính kịch"
    ],
    "countries": [
      "Hoa Kỳ"
    ],
    "director": "James Cameron",
    "cast": [
      "Leonardo DiCaprio",
      "Kate Winslet",
      "Billy Zane"
    ],
    "summary": "Jack và Rose, hai hành khách đến từ những tầng lớp khác nhau, gặp nhau trên chuyến hải hành đầu tiên của Titanic. Khi con tàu va phải băng trôi, tình yêu của họ trở thành cuộc chạy đua sinh tồn giữa đại dương lạnh giá.",
    "studio": "Paramount Pictures",
    "poster": "images/posters/titanic.jpg",
    "backdrop": null,
    "images": {
      "posterSource": "https://public-website-assets.paramountpictures.com/paramount2025/s3fs-public/styles/poster_medium/public/titanic2012_en_800x1200.jpg?itok=lbdE3VIG",
      "backdropSource": null,
      "page": "https://www.paramount.com/movies/titanic",
      "checkedAt": "2026-10-22"
    },
    "sources": {
      "info": "https://www.paramount.com/movies/titanic",
      "countries": "https://letterboxd.com/film/titanic-1997/",
      "runtime": "https://www.paramount.com/movies/titanic",
      "checkedAt": "2026-10-22"
    },
    "ratings": [
      {
        "source": "Metacritic",
        "label": "Metascore",
        "group": "critics",
        "metric": "rating",
        "value": 75,
        "scale": 100,
        "url": "https://www.metacritic.com/movie/titanic/",
        "checkedAt": "2026-10-22",
        "status": "verified"
      },
      {
        "source": "Metacritic",
        "label": "User Score",
        "group": "audience",
        "metric": "rating",
        "value": 8.3,
        "scale": 10,
        "url": "https://www.metacritic.com/movie/titanic/",
        "checkedAt": "2026-10-22",
        "status": "verified"
      }
    ]
  },
  {
    "id": "mission-impossible-fallout",
    "title": "Mission: Impossible – Fallout",
    "originalTitle": "Mission: Impossible – Fallout",
    "year": 2018,
    "runtime": 148,
    "genres": [
      "Hành động",
      "Phiêu lưu",
      "Giật gân"
    ],
    "countries": [
      "Hoa Kỳ"
    ],
    "director": "Christopher McQuarrie",
    "cast": [
      "Tom Cruise",
      "Henry Cavill",
      "Rebecca Ferguson"
    ],
    "summary": "Một nhiệm vụ thu hồi plutonium thất bại khiến Ethan Hunt cùng đội IMF phải chạy đua để ngăn thảm họa hạt nhân. Những đồng minh bất đắc dĩ và các động cơ khó đoán liên tục thử thách lòng tin trong đội.",
    "studio": "Paramount Pictures",
    "poster": "images/posters/mission-impossible-fallout.jpg",
    "backdrop": null,
    "images": {
      "posterSource": "https://public-website-assets.paramountpictures.com/paramount2025/s3fs-public/styles/poster_medium/public/missionimpossiblefallout_2018_dom_800x1200.jpg?itok=cv2NNFyP",
      "backdropSource": null,
      "page": "https://www.paramount.com/movies/mission-impossible-fallout",
      "checkedAt": "2026-10-22"
    },
    "sources": {
      "info": "https://www.paramount.com/movies/mission-impossible-fallout",
      "countries": "https://letterboxd.com/film/mission-impossible-fallout/",
      "runtime": "https://www.paramount.com/movies/mission-impossible-fallout",
      "checkedAt": "2026-10-22"
    },
    "ratings": [
      {
        "source": "Metacritic",
        "label": "Metascore",
        "group": "critics",
        "metric": "rating",
        "value": 87,
        "scale": 100,
        "url": "https://www.metacritic.com/movie/mission-impossible-fallout/",
        "checkedAt": "2026-10-22",
        "status": "verified"
      },
      {
        "source": "Metacritic",
        "label": "User Score",
        "group": "audience",
        "metric": "rating",
        "value": 8.3,
        "scale": 10,
        "url": "https://www.metacritic.com/movie/mission-impossible-fallout/",
        "checkedAt": "2026-10-22",
        "status": "verified"
      }
    ]
  },
  {
    "id": "everything-everywhere-all-at-once",
    "title": "Everything Everywhere All at Once",
    "originalTitle": "Everything Everywhere All at Once",
    "year": 2022,
    "runtime": 139,
    "genres": [
      "Hành động",
      "Hài",
      "Khoa học viễn tưởng"
    ],
    "countries": [
      "Hoa Kỳ"
    ],
    "director": "Daniel Kwan & Daniel Scheinert",
    "cast": [
      "Michelle Yeoh",
      "Stephanie Hsu",
      "Ke Huy Quan"
    ],
    "summary": "Evelyn Wang, người mẹ nhập cư đang chật vật với gia đình và tiệm giặt, bất ngờ bị cuốn vào một cuộc khủng hoảng đa vũ trụ. Những phiên bản cuộc đời khác nhau đưa bà trở lại câu hỏi về lựa chọn, sự kết nối và tình thân.",
    "studio": "A24",
    "poster": "images/posters/everything-everywhere-all-at-once.jpg",
    "backdrop": "images/backdrops/everything-everywhere-all-at-once.jpg",
    "images": {
      "posterSource": "https://api-asset-production.s3.amazonaws.com/media/images/letterboxd_-_Artboard_962x-100.jpg",
      "backdropSource": "https://api-asset-production.s3.amazonaws.com/media/images/EEAAO_Thumb_UPDATED_CLrwwZe.jpg",
      "page": "https://a24films.com/films/everything-everywhere-all-at-once",
      "checkedAt": "2026-10-22"
    },
    "sources": {
      "info": "https://a24films.com/films/everything-everywhere-all-at-once",
      "countries": "https://letterboxd.com/film/everything-everywhere-all-at-once/",
      "runtime": "https://www.metacritic.com/movie/everything-everywhere-all-at-once/",
      "checkedAt": "2026-10-22"
    },
    "ratings": [
      {
        "source": "Metacritic",
        "label": "Metascore",
        "group": "critics",
        "metric": "rating",
        "value": 81,
        "scale": 100,
        "url": "https://www.metacritic.com/movie/everything-everywhere-all-at-once/",
        "checkedAt": "2026-10-22",
        "status": "verified"
      },
      {
        "source": "Metacritic",
        "label": "User Score",
        "group": "audience",
        "metric": "rating",
        "value": 7.8,
        "scale": 10,
        "url": "https://www.metacritic.com/movie/everything-everywhere-all-at-once/",
        "checkedAt": "2026-10-22",
        "status": "verified"
      }
    ]
  },
  {
    "id": "past-lives",
    "title": "Past Lives",
    "originalTitle": "Past Lives",
    "year": 2023,
    "runtime": 106,
    "genres": [
      "Lãng mạn",
      "Chính kịch"
    ],
    "countries": [
      "Hoa Kỳ",
      "Hàn Quốc"
    ],
    "director": "Celine Song",
    "cast": [
      "Greta Lee",
      "Teo Yoo",
      "John Magaro"
    ],
    "summary": "Nora và Hae Sung là đôi bạn tuổi thơ chia xa khi gia đình Nora rời Hàn Quốc. Hai mươi năm sau, một tuần gặp lại tại New York khiến họ suy ngẫm về tình yêu, định mệnh và những lựa chọn đã tạo nên cuộc đời mỗi người.",
    "studio": "A24",
    "poster": "images/posters/past-lives.jpg",
    "backdrop": "images/backdrops/past-lives.jpg",
    "images": {
      "posterSource": "https://api-asset-production.s3.amazonaws.com/media/images/letterboxd_-_Artboard_682x-100.jpg",
      "backdropSource": "https://api-asset-production.s3.amazonaws.com/media/images/pl_thumb.jpeg",
      "page": "https://a24films.com/films/past-lives",
      "checkedAt": "2026-10-22"
    },
    "sources": {
      "info": "https://a24films.com/films/past-lives",
      "countries": "https://letterboxd.com/film/past-lives/",
      "runtime": "https://www.metacritic.com/movie/past-lives/",
      "checkedAt": "2026-10-22"
    },
    "ratings": [
      {
        "source": "Metacritic",
        "label": "Metascore",
        "group": "critics",
        "metric": "rating",
        "value": 94,
        "scale": 100,
        "url": "https://www.metacritic.com/movie/past-lives/",
        "checkedAt": "2026-10-22",
        "status": "verified"
      },
      {
        "source": "Metacritic",
        "label": "User Score",
        "group": "audience",
        "metric": "rating",
        "value": 7.8,
        "scale": 10,
        "url": "https://www.metacritic.com/movie/past-lives/",
        "checkedAt": "2026-10-22",
        "status": "verified"
      }
    ]
  },
  {
    "id": "moonlight",
    "title": "Moonlight",
    "originalTitle": "Moonlight",
    "year": 2016,
    "runtime": 111,
    "genres": [
      "Chính kịch"
    ],
    "countries": [
      "Hoa Kỳ"
    ],
    "director": "Barry Jenkins",
    "cast": [
      "Mahershala Ali",
      "Naomie Harris",
      "Trevante Rhodes"
    ],
    "summary": "Ba chương cuộc đời theo chân Chiron lớn lên ở Miami, từ một cậu bé cô độc tới tuổi trưởng thành. Những mối quan hệ và trải nghiệm yêu thương định hình hành trình tìm kiếm bản thân của anh.",
    "studio": "A24",
    "poster": "images/posters/moonlight.jpg",
    "backdrop": "images/backdrops/moonlight.jpg",
    "images": {
      "posterSource": "https://api-asset-production.s3.amazonaws.com/media/images/letterboxd_-_Artboard_612x-100.jpg",
      "backdropSource": "https://api-asset-production.s3.amazonaws.com/media/images/Moonlight_Thumb_UPDATED.jpg",
      "page": "https://a24films.com/films/moonlight",
      "checkedAt": "2026-10-22"
    },
    "sources": {
      "info": "https://a24films.com/films/moonlight",
      "countries": "https://letterboxd.com/film/moonlight-2016/",
      "runtime": "https://www.metacritic.com/movie/moonlight-2016/",
      "checkedAt": "2026-10-22"
    },
    "ratings": [
      {
        "source": "Metacritic",
        "label": "Metascore",
        "group": "critics",
        "metric": "rating",
        "value": 99,
        "scale": 100,
        "url": "https://www.metacritic.com/movie/moonlight-2016/",
        "checkedAt": "2026-10-22",
        "status": "verified"
      },
      {
        "source": "Metacritic",
        "label": "User Score",
        "group": "audience",
        "metric": "rating",
        "value": 7.1,
        "scale": 10,
        "url": "https://www.metacritic.com/movie/moonlight-2016/",
        "checkedAt": "2026-10-22",
        "status": "verified"
      }
    ]
  },
  {
    "id": "lady-bird",
    "title": "Lady Bird",
    "originalTitle": "Lady Bird",
    "year": 2017,
    "runtime": 94,
    "genres": [
      "Hài",
      "Chính kịch"
    ],
    "countries": [
      "Hoa Kỳ"
    ],
    "director": "Greta Gerwig",
    "cast": [
      "Saoirse Ronan",
      "Laurie Metcalf",
      "Timothée Chalamet"
    ],
    "summary": "Trong năm cuối trung học ở Sacramento, Christine tự gọi mình là Lady Bird và khao khát một cuộc đời khác. Những ước mơ tuổi trẻ va chạm với tình yêu, tình bạn và mối quan hệ vừa gần gũi vừa căng thẳng với mẹ.",
    "studio": "A24",
    "poster": "images/posters/lady-bird.jpg",
    "backdrop": "images/backdrops/lady-bird.jpg",
    "images": {
      "posterSource": "https://api-asset-production.s3.amazonaws.com/media/images/letterboxd_-_Artboard_1122x-100.jpg",
      "backdropSource": "https://api-asset-production.s3.amazonaws.com/media/images/Lady-Bird_Thumb_UPDATED.jpg",
      "page": "https://a24films.com/films/lady-bird",
      "checkedAt": "2026-10-22"
    },
    "sources": {
      "info": "https://a24films.com/films/lady-bird",
      "countries": "https://letterboxd.com/film/lady-bird/",
      "runtime": "https://www.metacritic.com/movie/lady-bird/",
      "checkedAt": "2026-10-22"
    },
    "ratings": [
      {
        "source": "Metacritic",
        "label": "Metascore",
        "group": "critics",
        "metric": "rating",
        "value": 93,
        "scale": 100,
        "url": "https://www.metacritic.com/movie/lady-bird/",
        "checkedAt": "2026-10-22",
        "status": "verified"
      },
      {
        "source": "Metacritic",
        "label": "User Score",
        "group": "audience",
        "metric": "rating",
        "value": 7.7,
        "scale": 10,
        "url": "https://www.metacritic.com/movie/lady-bird/",
        "checkedAt": "2026-10-22",
        "status": "verified"
      }
    ]
  },
  {
    "id": "minari",
    "title": "Minari",
    "originalTitle": "Minari",
    "year": 2020,
    "runtime": 115,
    "genres": [
      "Chính kịch"
    ],
    "countries": [
      "Hoa Kỳ"
    ],
    "director": "Lee Isaac Chung",
    "cast": [
      "Steven Yeun",
      "Yeri Han",
      "Youn Yuh-jung"
    ],
    "summary": "Một gia đình người Mỹ gốc Hàn chuyển tới trang trại nhỏ ở Arkansas để bắt đầu cuộc sống mới. Giữa những khó khăn của đất đai và gia đình, sự xuất hiện của người bà mở ra những kết nối bền bỉ với cội nguồn.",
    "studio": "A24",
    "poster": "images/posters/minari.jpg",
    "backdrop": "images/backdrops/minari.jpg",
    "images": {
      "posterSource": "https://api-asset-production.s3.amazonaws.com/media/images/letterboxd_-_Artboard_1032x-100.jpg",
      "backdropSource": "https://api-asset-production.s3.amazonaws.com/media/images/Minari_Thumb_UPDATED.jpg",
      "page": "https://a24films.com/films/minari",
      "checkedAt": "2026-10-22"
    },
    "sources": {
      "info": "https://a24films.com/films/minari",
      "countries": "https://letterboxd.com/film/minari/",
      "runtime": "https://www.metacritic.com/movie/minari/",
      "checkedAt": "2026-10-22"
    },
    "ratings": [
      {
        "source": "Metacritic",
        "label": "Metascore",
        "group": "critics",
        "metric": "rating",
        "value": 89,
        "scale": 100,
        "url": "https://www.metacritic.com/movie/minari/",
        "checkedAt": "2026-10-22",
        "status": "verified"
      },
      {
        "source": "Metacritic",
        "label": "User Score",
        "group": "audience",
        "metric": "rating",
        "value": 8,
        "scale": 10,
        "url": "https://www.metacritic.com/movie/minari/",
        "checkedAt": "2026-10-22",
        "status": "verified"
      }
    ]
  },
  {
    "id": "aftersun",
    "title": "Aftersun",
    "originalTitle": "Aftersun",
    "year": 2022,
    "runtime": 98,
    "genres": [
      "Chính kịch"
    ],
    "countries": [
      "Vương quốc Anh",
      "Hoa Kỳ"
    ],
    "director": "Charlotte Wells",
    "cast": [
      "Paul Mescal",
      "Frankie Corio",
      "Celia Rowlson-Hall"
    ],
    "summary": "Sophie nhìn lại kỳ nghỉ với cha hai mươi năm trước qua những đoạn băng máy quay và ký ức rời rạc. Niềm vui thời thơ ấu dần đan xen với những điều cô chưa thể hiểu về người cha khi ấy.",
    "studio": "A24",
    "poster": "images/posters/aftersun.jpg",
    "backdrop": "images/backdrops/aftersun.jpg",
    "images": {
      "posterSource": "https://api-asset-production.s3.amazonaws.com/media/images/aftersun.jpg",
      "backdropSource": "https://api-asset-production.s3.amazonaws.com/media/images/Aftersun_Thumb_UPDATED_JTdLOoG.jpg",
      "page": "https://a24films.com/films/aftersun",
      "checkedAt": "2026-10-22"
    },
    "sources": {
      "info": "https://a24films.com/films/aftersun",
      "countries": "https://letterboxd.com/film/aftersun/",
      "runtime": "https://www.metacritic.com/movie/aftersun/",
      "checkedAt": "2026-10-22"
    },
    "ratings": [
      {
        "source": "Metacritic",
        "label": "Metascore",
        "group": "critics",
        "metric": "rating",
        "value": 95,
        "scale": 100,
        "url": "https://www.metacritic.com/movie/aftersun/",
        "checkedAt": "2026-10-22",
        "status": "verified"
      },
      {
        "source": "Metacritic",
        "label": "User Score",
        "group": "audience",
        "metric": "rating",
        "value": 8,
        "scale": 10,
        "url": "https://www.metacritic.com/movie/aftersun/",
        "checkedAt": "2026-10-22",
        "status": "verified"
      }
    ]
  },
  {
    "id": "the-farewell",
    "title": "The Farewell",
    "originalTitle": "The Farewell",
    "year": 2019,
    "runtime": 100,
    "genres": [
      "Hài",
      "Chính kịch"
    ],
    "countries": [
      "Trung Quốc",
      "Hoa Kỳ"
    ],
    "director": "Lulu Wang",
    "cast": [
      "Awkwafina",
      "Zhao Shuzhen",
      "Tzi Ma"
    ],
    "summary": "Billi trở về Trung Quốc khi biết bà nội mắc bệnh nặng, nhưng gia đình quyết định giấu bà sự thật. Một đám cưới được tổ chức để mọi người có dịp đoàn tụ, đặt Billi giữa hai cách nhìn về yêu thương và trách nhiệm.",
    "studio": "A24",
    "poster": "images/posters/the-farewell.jpg",
    "backdrop": "images/backdrops/the-farewell.jpg",
    "images": {
      "posterSource": "https://api-asset-production.s3.amazonaws.com/media/images/the_farewell.jpg",
      "backdropSource": "https://api-asset-production.s3.amazonaws.com/media/images/The-Farewell_Thumb_UPDATED.jpg",
      "page": "https://a24films.com/films/the-farewell",
      "checkedAt": "2026-10-22"
    },
    "sources": {
      "info": "https://a24films.com/films/the-farewell",
      "countries": "https://letterboxd.com/film/the-farewell-2019/",
      "runtime": "https://www.metacritic.com/movie/the-farewell/",
      "checkedAt": "2026-10-22"
    },
    "ratings": [
      {
        "source": "Metacritic",
        "label": "Metascore",
        "group": "critics",
        "metric": "rating",
        "value": 89,
        "scale": 100,
        "url": "https://www.metacritic.com/movie/the-farewell/",
        "checkedAt": "2026-10-22",
        "status": "verified"
      },
      {
        "source": "Metacritic",
        "label": "User Score",
        "group": "audience",
        "metric": "rating",
        "value": 8.2,
        "scale": 10,
        "url": "https://www.metacritic.com/movie/the-farewell/",
        "checkedAt": "2026-10-22",
        "status": "verified"
      }
    ]
  },
  {
    "id": "uncut-gems",
    "title": "Uncut Gems",
    "originalTitle": "Uncut Gems",
    "year": 2019,
    "runtime": 135,
    "genres": [
      "Tội phạm",
      "Giật gân",
      "Chính kịch"
    ],
    "countries": [
      "Hoa Kỳ"
    ],
    "director": "Josh Safdie & Benny Safdie",
    "cast": [
      "Adam Sandler",
      "LaKeith Stanfield",
      "Julia Fox"
    ],
    "summary": "Howard Ratner, một chủ tiệm kim hoàn ở New York, liên tục tìm kiếm vận may qua những thương vụ và cá cược mạo hiểm. Khi các món nợ cùng áp lực gia đình dồn tới, anh đặt tất cả vào một chuỗi lựa chọn ngày càng nguy hiểm.",
    "studio": "A24",
    "poster": "images/posters/uncut-gems.jpg",
    "backdrop": "images/backdrops/uncut-gems.jpg",
    "images": {
      "posterSource": "https://api-asset-production.s3.amazonaws.com/media/images/letterboxd_-_Artboard_602x-100.jpg",
      "backdropSource": "https://api-asset-production.s3.amazonaws.com/media/images/Uncut-Gems_Thumb_UPDATED.jpg",
      "page": "https://a24films.com/films/uncut-gems",
      "checkedAt": "2026-10-22"
    },
    "sources": {
      "info": "https://a24films.com/films/uncut-gems",
      "countries": "https://letterboxd.com/film/uncut-gems/",
      "runtime": "https://www.metacritic.com/movie/uncut-gems/",
      "checkedAt": "2026-10-22"
    },
    "ratings": [
      {
        "source": "Metacritic",
        "label": "Metascore",
        "group": "critics",
        "metric": "rating",
        "value": 93,
        "scale": 100,
        "url": "https://www.metacritic.com/movie/uncut-gems/",
        "checkedAt": "2026-10-22",
        "status": "verified"
      },
      {
        "source": "Metacritic",
        "label": "User Score",
        "group": "audience",
        "metric": "rating",
        "value": 7.2,
        "scale": 10,
        "url": "https://www.metacritic.com/movie/uncut-gems/",
        "checkedAt": "2026-10-22",
        "status": "verified"
      }
    ]
  }
];
  const freeze = value => {
    if (value && typeof value === 'object' && !Object.isFrozen(value)) {
      Object.values(value).forEach(freeze); Object.freeze(value);
    }
    return value;
  };
  window.KH = window.KH || {};
  window.KH.movies = freeze(movies);
})();
