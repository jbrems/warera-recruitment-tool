## Supported countries
Belgium - 6813b6d446e731854c7ac7a4

## Fetch users of the chosen country
Send a POST request to https://api2.warera.io/trpc/user.getUsersByCountry
With a JSON body
```
{
  "countryId": "<the country id as a string>",
  "limit": 100,
  "cursor": ""
}
```

You will receive a JSON response like
```
{
    "result": {
        "data": {
            "items": [
                {
                    "_id": "69cfd1565752aefa8b3caaca",
                    "createdAt": "2026-04-03T14:40:22.780Z"
                },
                {
                    "_id": "69cc3b1e16465e8b93ae86ef",
                    "createdAt": "2026-03-31T21:22:38.526Z"
                },
                {
                    "_id": "69cbce1cea7d40a331b57840",
                    "createdAt": "2026-03-31T13:37:32.252Z"
                },
                {
                    "_id": "69caa9edb37e0eb78f499cff",
                    "createdAt": "2026-03-30T16:50:53.436Z"
                },
                {
                    "_id": "69c9672f7eb847836dbecbc0",
                    "createdAt": "2026-03-29T17:53:51.236Z"
                },
                {
                    "_id": "69c956ee18ecd73bdbc0cca9",
                    "createdAt": "2026-03-29T16:44:30.612Z"
                },
                {
                    "_id": "69c69f12cbdcd4950c497551",
                    "createdAt": "2026-03-27T15:15:30.811Z"
                },
                {
                    "_id": "69c65cfcc1a06d6b1e74ecfd",
                    "createdAt": "2026-03-27T10:33:32.278Z"
                },
                {
                    "_id": "69c4dc19cde5836cb7979931",
                    "createdAt": "2026-03-26T07:11:21.651Z"
                },
                {
                    "_id": "69c3a26dcde5836cb7913352",
                    "createdAt": "2026-03-25T08:53:01.326Z"
                },
                {
                    "_id": "69c1b216585318550a96d4fd",
                    "createdAt": "2026-03-23T21:35:18.139Z"
                },
                {
                    "_id": "69c1b1f7585318550a94c71b",
                    "createdAt": "2026-03-23T21:34:47.927Z"
                },
                {
                    "_id": "69bff9638103f757c559713e",
                    "createdAt": "2026-03-22T14:14:59.350Z"
                },
                {
                    "_id": "69bc678d0f50f6f334a3c4aa",
                    "createdAt": "2026-03-19T21:15:57.783Z"
                },
                {
                    "_id": "69ba42913f756b6d59c124e2",
                    "createdAt": "2026-03-18T06:13:37.788Z"
                },
                {
                    "_id": "69b85514c0dd19d33218e8d4",
                    "createdAt": "2026-03-16T19:08:04.560Z"
                },
                {
                    "_id": "69b7bf95ca9a42b7ef66b7de",
                    "createdAt": "2026-03-16T08:30:13.264Z"
                },
                {
                    "_id": "69b73e37805a5bf5ae2b2bdc",
                    "createdAt": "2026-03-15T23:18:15.059Z"
                },
                {
                    "_id": "69b515a8570f1d3becbbf12a",
                    "createdAt": "2026-03-14T08:00:40.471Z"
                },
                {
                    "_id": "69b492545f34cb744fd46517",
                    "createdAt": "2026-03-13T22:40:20.542Z"
                },
                {
                    "_id": "69b480b421a9ed4b968a4a40",
                    "createdAt": "2026-03-13T21:25:08.624Z"
                },
                {
                    "_id": "69b46b4bb34bca57fd13eba1",
                    "createdAt": "2026-03-13T19:53:47.901Z"
                },
                {
                    "_id": "69b41ca244d8293440241af1",
                    "createdAt": "2026-03-13T14:18:10.091Z"
                },
                {
                    "_id": "69b323877972e334e3bd22da",
                    "createdAt": "2026-03-12T20:35:19.245Z"
                },
                {
                    "_id": "69b311efcbf2b5c108a623af",
                    "createdAt": "2026-03-12T19:20:15.053Z"
                },
                {
                    "_id": "69b310c919f98f6ceba5b93e",
                    "createdAt": "2026-03-12T19:15:21.594Z"
                },
                {
                    "_id": "69b2b6de36fe96b989c5efac",
                    "createdAt": "2026-03-12T12:51:42.824Z"
                },
                {
                    "_id": "69b2b1342895f070b7432d7e",
                    "createdAt": "2026-03-12T12:27:32.941Z"
                },
                {
                    "_id": "69b2a698a583a3b5f9567890",
                    "createdAt": "2026-03-12T11:42:16.519Z"
                },
                {
                    "_id": "69b29bce2895f070b7e6fe90",
                    "createdAt": "2026-03-12T10:56:14.645Z"
                },
                {
                    "_id": "69b27c9684786b5c773376ed",
                    "createdAt": "2026-03-12T08:43:02.343Z"
                },
                {
                    "_id": "69b0aedccbf2b5c108e339a1",
                    "createdAt": "2026-03-10T23:53:00.603Z"
                },
                {
                    "_id": "69b03d1b4a0b814a34e06e9a",
                    "createdAt": "2026-03-10T15:47:39.800Z"
                },
                {
                    "_id": "69afe4f86dcb0df73b158b44",
                    "createdAt": "2026-03-10T09:31:36.084Z"
                },
                {
                    "_id": "69af4a68c5949dae6b93b391",
                    "createdAt": "2026-03-09T22:32:08.174Z"
                },
                {
                    "_id": "69aed4cf4b0d180f67567a54",
                    "createdAt": "2026-03-09T14:10:23.588Z"
                },
                {
                    "_id": "69ae8a5b85ba2a296e70f5a8",
                    "createdAt": "2026-03-09T08:52:43.297Z"
                },
                {
                    "_id": "69ae892e6157435c4f347741",
                    "createdAt": "2026-03-09T08:47:42.295Z"
                },
                {
                    "_id": "69ae854f85ba2a296e65bf19",
                    "createdAt": "2026-03-09T08:31:11.822Z"
                },
                {
                    "_id": "69ae5198b5486e4fd9bba5e3",
                    "createdAt": "2026-03-09T04:50:32.650Z"
                },
                {
                    "_id": "69ae38c6965d2ea761f92739",
                    "createdAt": "2026-03-09T03:04:38.906Z"
                },
                {
                    "_id": "69ae007fa583a3b5f9eb48e8",
                    "createdAt": "2026-03-08T23:04:31.506Z"
                },
                {
                    "_id": "69adddd18ebbacc9d8deb9cf",
                    "createdAt": "2026-03-08T20:36:33.829Z"
                },
                {
                    "_id": "69addb4636862bfb16652a10",
                    "createdAt": "2026-03-08T20:25:42.276Z"
                },
                {
                    "_id": "69adcb8c142f25fd63640ba0",
                    "createdAt": "2026-03-08T19:18:36.877Z"
                },
                {
                    "_id": "69adc5e3269bf5adbe4b717b",
                    "createdAt": "2026-03-08T18:54:27.150Z"
                },
                {
                    "_id": "69adc1abc6c0c481f67c24a2",
                    "createdAt": "2026-03-08T18:36:27.163Z"
                },
                {
                    "_id": "69adbea9269bf5adbebdee8b",
                    "createdAt": "2026-03-08T18:23:37.219Z"
                },
                {
                    "_id": "69ad702a1d11bcdf4ff54ad8",
                    "createdAt": "2026-03-08T12:48:42.844Z"
                },
                {
                    "_id": "69acb043142f25fd63492b19",
                    "createdAt": "2026-03-07T23:09:55.355Z"
                },
                {
                    "_id": "69ac8f85ac2b30958606fce6",
                    "createdAt": "2026-03-07T20:50:13.206Z"
                },
                {
                    "_id": "69ac43d24442e986dfa502df",
                    "createdAt": "2026-03-07T15:27:14.626Z"
                },
                {
                    "_id": "69ac3f3544ea555261fb5d70",
                    "createdAt": "2026-03-07T15:07:33.943Z"
                },
                {
                    "_id": "69abfedb9db4eee6818b498a",
                    "createdAt": "2026-03-07T10:32:59.962Z"
                },
                {
                    "_id": "69abda911f0663a58dfceda1",
                    "createdAt": "2026-03-07T07:58:09.767Z"
                },
                {
                    "_id": "69ab81627a78c9de85720207",
                    "createdAt": "2026-03-07T01:37:38.901Z"
                },
                {
                    "_id": "69ab31eee99917779044e6f5",
                    "createdAt": "2026-03-06T19:58:38.841Z"
                },
                {
                    "_id": "69ab13d762639a4c2ea70985",
                    "createdAt": "2026-03-06T17:50:15.254Z"
                },
                {
                    "_id": "69aaedfc5f0eac1a1ee67617",
                    "createdAt": "2026-03-06T15:08:44.934Z"
                },
                {
                    "_id": "69aab1031f0663a58d2c84b3",
                    "createdAt": "2026-03-06T10:48:35.308Z"
                },
                {
                    "_id": "69aaab706fd1715e17e62ff9",
                    "createdAt": "2026-03-06T10:24:48.439Z"
                },
                {
                    "_id": "69aaa45e3d0ff1dda01863b3",
                    "createdAt": "2026-03-06T09:54:38.339Z"
                },
                {
                    "_id": "69a9f69a7516aabe32233698",
                    "createdAt": "2026-03-05T21:33:14.867Z"
                },
                {
                    "_id": "69a986a9a487a2280bec9e2a",
                    "createdAt": "2026-03-05T13:35:37.058Z"
                },
                {
                    "_id": "69a8c9bc56d3e365d006f1a0",
                    "createdAt": "2026-03-05T00:09:32.967Z"
                },
                {
                    "_id": "69a828ee9f45fab73d83898f",
                    "createdAt": "2026-03-04T12:43:26.534Z"
                },
                {
                    "_id": "69a7f84bf9677c827c743c5a",
                    "createdAt": "2026-03-04T09:15:55.400Z"
                },
                {
                    "_id": "69a6d27543bacf2775b97b6a",
                    "createdAt": "2026-03-03T12:22:13.255Z"
                },
                {
                    "_id": "69a676974310608e3119ee90",
                    "createdAt": "2026-03-03T05:50:15.306Z"
                },
                {
                    "_id": "69a5f6c8f0213d88951a140a",
                    "createdAt": "2026-03-02T20:44:56.505Z"
                },
                {
                    "_id": "69a5dcef525a49cf7b6addbc",
                    "createdAt": "2026-03-02T18:54:39.798Z"
                },
                {
                    "_id": "69a4bf37453e47d4b80d3e63",
                    "createdAt": "2026-03-01T22:35:35.779Z"
                },
                {
                    "_id": "69a49ef165f1b8bd940b25a0",
                    "createdAt": "2026-03-01T20:17:53.031Z"
                },
                {
                    "_id": "69a49954f9624a39ed64b323",
                    "createdAt": "2026-03-01T19:53:56.139Z"
                },
                {
                    "_id": "69a480a37f83b37958184791",
                    "createdAt": "2026-03-01T18:08:35.205Z"
                },
                {
                    "_id": "69a471210e06d6a1462495ae",
                    "createdAt": "2026-03-01T17:02:25.103Z"
                },
                {
                    "_id": "69a452ef5859d8e92868cb30",
                    "createdAt": "2026-03-01T14:53:35.508Z"
                },
                {
                    "_id": "69a3986a44ecd47e60609e44",
                    "createdAt": "2026-03-01T01:37:46.547Z"
                },
                {
                    "_id": "69a373e7d3f08549ea61fc03",
                    "createdAt": "2026-02-28T23:01:59.360Z"
                },
                {
                    "_id": "69a31367bc52dc98d98ce5da",
                    "createdAt": "2026-02-28T16:10:15.261Z"
                },
                {
                    "_id": "69a311c43ccd6fd4f8e57e82",
                    "createdAt": "2026-02-28T16:03:16.329Z"
                },
                {
                    "_id": "69a2e393effcd810650a943c",
                    "createdAt": "2026-02-28T12:46:11.625Z"
                },
                {
                    "_id": "69a296a44d29cddbbfdd1539",
                    "createdAt": "2026-02-28T07:17:56.214Z"
                },
                {
                    "_id": "69a281a1a56b220906040c7e",
                    "createdAt": "2026-02-28T05:48:17.857Z"
                },
                {
                    "_id": "69a232743a30eb0a028e64e4",
                    "createdAt": "2026-02-28T00:10:28.053Z"
                },
                {
                    "_id": "69a20a8aedead93810e79228",
                    "createdAt": "2026-02-27T21:20:10.049Z"
                },
                {
                    "_id": "69a2066dc9b483e10f662e1d",
                    "createdAt": "2026-02-27T21:02:37.577Z"
                },
                {
                    "_id": "69a1f090e0f6a03cb88c473f",
                    "createdAt": "2026-02-27T19:29:20.742Z"
                },
                {
                    "_id": "69a1d20d10e40fb934e1cacd",
                    "createdAt": "2026-02-27T17:19:09.462Z"
                },
                {
                    "_id": "69a16ae58da306e895e98b57",
                    "createdAt": "2026-02-27T09:59:01.882Z"
                },
                {
                    "_id": "69a0e739acd5ab212e738159",
                    "createdAt": "2026-02-27T00:37:13.124Z"
                },
                {
                    "_id": "69a07bc29cc632f1dcb018d2",
                    "createdAt": "2026-02-26T16:58:42.497Z"
                },
                {
                    "_id": "69a00c2dbf23e24f7562931b",
                    "createdAt": "2026-02-26T09:02:37.485Z"
                },
                {
                    "_id": "699dd7186d2ef0246cb6a48e",
                    "createdAt": "2026-02-24T16:51:36.954Z"
                },
                {
                    "_id": "699d7bb80fc8c21bf309ba0a",
                    "createdAt": "2026-02-24T10:21:44.910Z"
                },
                {
                    "_id": "699cedc9da81370bb120105c",
                    "createdAt": "2026-02-24T00:16:09.052Z"
                },
                {
                    "_id": "699cd3c5b4bcdcca6227d18e",
                    "createdAt": "2026-02-23T22:25:09.198Z"
                },
                {
                    "_id": "699ca0f8fe82f2785f306b31",
                    "createdAt": "2026-02-23T18:48:24.067Z"
                },
                {
                    "_id": "699c47625fd2c21f5c64f81f",
                    "createdAt": "2026-02-23T12:26:10.377Z"
                },
                {
                    "_id": "699c186240f66da723aefaaa",
                    "createdAt": "2026-02-23T09:05:38.141Z"
                }
            ],
            "nextCursor": "Mon Feb 23 2026 09:05:38 GMT+0000 (Coordinated Universal Time)|699c186240f66da723aefaaa"
        }
    }
}
```

To fetch the next batch of users, send the request again with the value of `nextCursor` as `cursor`.
