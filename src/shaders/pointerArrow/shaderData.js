export const data = {
    "version": 1,
    "uniforms": [
      {
        "name": "ColorBottomIntensity",
        "type": "float",
        "value": 1
      },
      {
        "name": "ColorBottom",
        "type": "vec4",
        "value": {
          "x": 0.12549019607843137,
          "y": 0.2980392156862745,
          "z": 0.9607843137254902,
          "w": 1
        }
      },
      {
        "name": "BottomCenterOP",
        "type": "float",
        "value": 0.6
      },
      {
        "name": "BottomEdgeOP",
        "type": "float",
        "value": 0.89
      },
      {
        "name": "BottomStepMin",
        "type": "float",
        "value": 0
      },
      {
        "name": "BottomSmooth",
        "type": "float",
        "value": 1
      },
      {
        "name": "EdgeWidth",
        "type": "float",
        "value": 0.05
      },
      {
        "name": "DottedPosition",
        "type": "float",
        "value": 0.43
      },
      {
        "name": "DottedSmooth",
        "type": "float",
        "value": 0.24
      },
      {
        "name": "ColorArrow",
        "type": "vec4",
        "value": {
          "x": 0.7843137254901961,
          "y": 0.8627450980392157,
          "z": 1,
          "w": 1
        }
      },
      {
        "name": "ColorArrowIntensity",
        "type": "float",
        "value": 1
      },
      {
        "name": "ColorEdge",
        "type": "vec4",
        "value": {
          "x": 0.13725490196078433,
          "y": 0.3411764705882353,
          "z": 0.9803921568627451,
          "w": 1
        }
      },
      {
        "name": "ColorEdgeIntensity",
        "type": "float",
        "value": 1
      },
      {
        "name": "Angle",
        "type": "float",
        "value": 55
      },
      {
        "name": "Tilling",
        "type": "float",
        "value": 0.1
      },
      {
        "name": "UnitLength",
        "type": "float",
        "value": 20
      },
      {
        "name": "_time",
        "type": "float",
        "value": 0
      },
      {
        "name": "Speed",
        "type": "float",
        "value": 2
      },
      {
        "name": "ArrowThickness1",
        "type": "float",
        "value": 0.28
      },
      {
        "name": "ArrowWidth",
        "type": "float",
        "value": 0.14
      },
      {
        "name": "ArrowLength",
        "type": "float",
        "value": 0.48
      },
      {
        "name": "ArrowThickness2",
        "type": "float",
        "value": 0.07
      },
      {
        "name": "ArrowShapeChange",
        "type": "float",
        "value": 0
      },
      {
        "name": "ColorError",
        "type": "vec4",
        "value": {
          "x": 1,
          "y": 0,
          "z": 0,
          "w": 1
        }
      },
      {
        "name": "ColorErrorIntensity",
        "type": "float",
        "value": 1
      },
      {
        "name": "ErrorPosition",
        "type": "float",
        "value": 0.02
      },
      {
        "name": "ErrorSmooth",
        "type": "float",
        "value": 0.98
      },
      {
        "name": "ErrorON",
        "type": "float",
        "value": 0
      },
      {
        "name": "BottomOP",
        "type": "float",
        "value": 0.4
      },
      {
        "name": "ShapeOP",
        "type": "float",
        "value": 1
      },
      {
        "name": "EndLength",
        "type": "float",
        "value": 0.8
      },
      {
        "name": "EndSmooth",
        "type": "float",
        "value": 1
      }
    ],
    "vertex": "// Created with NodeToy | Three.js r149\n\n// <node_builder>\n\n// uniforms\n\n// attributes\n\n// varys\nvarying vec2 nodeVary0; \n// vars\n\n// codes\n\n// variables\n// </node_builder>\n\n\n\n\n\n\n\n\n#define PI 3.141592653589793\n#define PI2 6.283185307179586\n#define PI_HALF 1.5707963267948966\n#define RECIPROCAL_PI 0.3183098861837907\n#define RECIPROCAL_PI2 0.15915494309189535\n#define EPSILON 1e-6\n\n#ifndef saturate\n// <tonemapping_pars_fragment> may have defined saturate() already\n#define saturate( a ) clamp( a, 0.0, 1.0 )\n#endif\n#define whiteComplement( a ) ( 1.0 - saturate( a ) )\n\nfloat pow2( const in float x ) { return x*x; }\nvec3 pow2( const in vec3 x ) { return x*x; }\nfloat pow3( const in float x ) { return x*x*x; }\nfloat pow4( const in float x ) { float x2 = x*x; return x2*x2; }\nfloat max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }\nfloat average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }\n\n// expects values in the range of [0,1]x[0,1], returns values in the [0,1] range.\n// do not collapse into a single function per: http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/\nhighp float rand( const in vec2 uv ) {\n\n\tconst highp float a = 12.9898, b = 78.233, c = 43758.5453;\n\thighp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );\n\n\treturn fract( sin( sn ) * c );\n\n}\n\n#ifdef HIGH_PRECISION\n\tfloat precisionSafeLength( vec3 v ) { return length( v ); }\n#else\n\tfloat precisionSafeLength( vec3 v ) {\n\t\tfloat maxComponent = max3( abs( v ) );\n\t\treturn length( v / maxComponent ) * maxComponent;\n\t}\n#endif\n\nstruct IncidentLight {\n\tvec3 color;\n\tvec3 direction;\n\tbool visible;\n};\n\nstruct ReflectedLight {\n\tvec3 directDiffuse;\n\tvec3 directSpecular;\n\tvec3 indirectDiffuse;\n\tvec3 indirectSpecular;\n};\n\nstruct GeometricContext {\n\tvec3 position;\n\tvec3 normal;\n\tvec3 viewDir;\n#ifdef USE_CLEARCOAT\n\tvec3 clearcoatNormal;\n#endif\n};\n\nvec3 transformDirection( in vec3 dir, in mat4 matrix ) {\n\n\treturn normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );\n\n}\n\nvec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {\n\n\t// dir can be either a direction vector or a normal vector\n\t// upper-left 3x3 of matrix is assumed to be orthogonal\n\n\treturn normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );\n\n}\n\nmat3 transposeMat3( const in mat3 m ) {\n\n\tmat3 tmp;\n\n\ttmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );\n\ttmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );\n\ttmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );\n\n\treturn tmp;\n\n}\n\nfloat luminance( const in vec3 rgb ) {\n\n\t// assumes rgb is in linear color space with sRGB primaries and D65 white point\n\n\tconst vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );\n\n\treturn dot( weights, rgb );\n\n}\n\nbool isPerspectiveMatrix( mat4 m ) {\n\n\treturn m[ 2 ][ 3 ] == - 1.0;\n\n}\n\nvec2 equirectUv( in vec3 dir ) {\n\n\t// dir is assumed to be unit length\n\n\tfloat u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;\n\n\tfloat v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;\n\n\treturn vec2( u, v );\n\n}\n\n\n#ifdef USE_UV\n\n\t#ifdef UVS_VERTEX_ONLY\n\n\t\tvec2 vUv;\n\n\t#else\n\n\t\tvarying vec2 vUv;\n\n\t#endif\n\n\tuniform mat3 uvTransform;\n\n#endif\n\n\n#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )\n\n\tattribute vec2 uv2;\n\tvarying vec2 vUv2;\n\n\tuniform mat3 uv2Transform;\n\n#endif\n\n\n#ifdef USE_ENVMAP\n\n\t#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )\n\n\t\t#define ENV_WORLDPOS\n\n\t#endif\n\n\t#ifdef ENV_WORLDPOS\n\t\t\n\t\tvarying vec3 vWorldPosition;\n\n\t#else\n\n\t\tvarying vec3 vReflect;\n\t\tuniform float refractionRatio;\n\n\t#endif\n\n#endif\n\n\n#if defined( USE_COLOR_ALPHA )\n\n\tvarying vec4 vColor;\n\n#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )\n\n\tvarying vec3 vColor;\n\n#endif\n\n\n#ifdef USE_FOG\n\n\tvarying float vFogDepth;\n\n#endif\n\n\n#ifdef USE_MORPHTARGETS\n\n\tuniform float morphTargetBaseInfluence;\n\n\t#ifdef MORPHTARGETS_TEXTURE\n\n\t\tuniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];\n\t\tuniform sampler2DArray morphTargetsTexture;\n\t\tuniform ivec2 morphTargetsTextureSize;\n\n\t\tvec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {\n\n\t\t\tint texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;\n\t\t\tint y = texelIndex / morphTargetsTextureSize.x;\n\t\t\tint x = texelIndex - y * morphTargetsTextureSize.x;\n\n\t\t\tivec3 morphUV = ivec3( x, y, morphTargetIndex );\n\t\t\treturn texelFetch( morphTargetsTexture, morphUV, 0 );\n\n\t\t}\n\n\t#else\n\n\t\t#ifndef USE_MORPHNORMALS\n\n\t\t\tuniform float morphTargetInfluences[ 8 ];\n\n\t\t#else\n\n\t\t\tuniform float morphTargetInfluences[ 4 ];\n\n\t\t#endif\n\n\t#endif\n\n#endif\n\n\n#ifdef USE_SKINNING\n\n\tuniform mat4 bindMatrix;\n\tuniform mat4 bindMatrixInverse;\n\n\tuniform highp sampler2D boneTexture;\n\tuniform int boneTextureSize;\n\n\tmat4 getBoneMatrix( const in float i ) {\n\n\t\tfloat j = i * 4.0;\n\t\tfloat x = mod( j, float( boneTextureSize ) );\n\t\tfloat y = floor( j / float( boneTextureSize ) );\n\n\t\tfloat dx = 1.0 / float( boneTextureSize );\n\t\tfloat dy = 1.0 / float( boneTextureSize );\n\n\t\ty = dy * ( y + 0.5 );\n\n\t\tvec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );\n\t\tvec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );\n\t\tvec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );\n\t\tvec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );\n\n\t\tmat4 bone = mat4( v1, v2, v3, v4 );\n\n\t\treturn bone;\n\n\t}\n\n#endif\n\n\n#ifdef USE_LOGDEPTHBUF\n\n\t#ifdef USE_LOGDEPTHBUF_EXT\n\n\t\tvarying float vFragDepth;\n\t\tvarying float vIsPerspective;\n\n\t#else\n\n\t\tuniform float logDepthBufFC;\n\n\t#endif\n\n#endif\n\n\n#if NUM_CLIPPING_PLANES > 0\n\n\tvarying vec3 vClipPosition;\n\n#endif\n\n\nvoid main() {\nnodeVary0 = uv;\n\t\n\n\n\n#ifdef USE_UV\n\n\tvUv = ( uvTransform * vec3( uv, 1 ) ).xy;\n\n#endif\n\n\n#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )\n\n\tvUv2 = ( uv2Transform * vec3( uv2, 1 ) ).xy;\n\n#endif\n\n\n#if defined( USE_COLOR_ALPHA )\n\n\tvColor = vec4( 1.0 );\n\n#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )\n\n\tvColor = vec3( 1.0 );\n\n#endif\n\n#ifdef USE_COLOR\n\n\tvColor *= color;\n\n#endif\n\n#ifdef USE_INSTANCING_COLOR\n\n\tvColor.xyz *= instanceColor.xyz;\n\n#endif\n\n\n#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )\n\n\t// morphTargetBaseInfluence is set based on BufferGeometry.morphTargetsRelative value:\n\t// When morphTargetsRelative is false, this is set to 1 - sum(influences); this results in normal = sum((target - base) * influence)\n\t// When morphTargetsRelative is true, this is set to 1; as a result, all morph targets are simply added to the base after weighting\n\tvColor *= morphTargetBaseInfluence;\n\n\tfor ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {\n\n\t\t#if defined( USE_COLOR_ALPHA )\n\n\t\t\tif ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];\n\n\t\t#elif defined( USE_COLOR )\n\n\t\t\tif ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];\n\n\t\t#endif\n\n\t}\n\n#endif\n\n\n\t#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )\n\n\nvec3 objectNormal = vec3( normal );\n\n#ifdef USE_TANGENT\n\n\tvec3 objectTangent = vec3( tangent.xyz );\n\n#endif\n\n\n#ifdef USE_MORPHNORMALS\n\n\t// morphTargetBaseInfluence is set based on BufferGeometry.morphTargetsRelative value:\n\t// When morphTargetsRelative is false, this is set to 1 - sum(influences); this results in normal = sum((target - base) * influence)\n\t// When morphTargetsRelative is true, this is set to 1; as a result, all morph targets are simply added to the base after weighting\n\tobjectNormal *= morphTargetBaseInfluence;\n\n\t#ifdef MORPHTARGETS_TEXTURE\n\n\t\tfor ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {\n\n\t\t\tif ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];\n\n\t\t}\n\n\t#else\n\n\t\tobjectNormal += morphNormal0 * morphTargetInfluences[ 0 ];\n\t\tobjectNormal += morphNormal1 * morphTargetInfluences[ 1 ];\n\t\tobjectNormal += morphNormal2 * morphTargetInfluences[ 2 ];\n\t\tobjectNormal += morphNormal3 * morphTargetInfluences[ 3 ];\n\n\t#endif\n\n#endif\n\n\n#ifdef USE_SKINNING\n\n\tmat4 boneMatX = getBoneMatrix( skinIndex.x );\n\tmat4 boneMatY = getBoneMatrix( skinIndex.y );\n\tmat4 boneMatZ = getBoneMatrix( skinIndex.z );\n\tmat4 boneMatW = getBoneMatrix( skinIndex.w );\n\n#endif\n\n\n#ifdef USE_SKINNING\n\n\tmat4 skinMatrix = mat4( 0.0 );\n\tskinMatrix += skinWeight.x * boneMatX;\n\tskinMatrix += skinWeight.y * boneMatY;\n\tskinMatrix += skinWeight.z * boneMatZ;\n\tskinMatrix += skinWeight.w * boneMatW;\n\tskinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;\n\n\tobjectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;\n\n\t#ifdef USE_TANGENT\n\n\t\tobjectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;\n\n\t#endif\n\n#endif\n\n\nvec3 transformedNormal = objectNormal;\n\n#ifdef USE_INSTANCING\n\n\t// this is in lieu of a per-instance normal-matrix\n\t// shear transforms in the instance matrix are not supported\n\n\tmat3 m = mat3( instanceMatrix );\n\n\ttransformedNormal /= vec3( dot( m[ 0 ], m[ 0 ] ), dot( m[ 1 ], m[ 1 ] ), dot( m[ 2 ], m[ 2 ] ) );\n\n\ttransformedNormal = m * transformedNormal;\n\n#endif\n\ntransformedNormal = normalMatrix * transformedNormal;\n\n#ifdef FLIP_SIDED\n\n\ttransformedNormal = - transformedNormal;\n\n#endif\n\n#ifdef USE_TANGENT\n\n\tvec3 transformedTangent = ( modelViewMatrix * vec4( objectTangent, 0.0 ) ).xyz;\n\n\t#ifdef FLIP_SIDED\n\n\t\ttransformedTangent = - transformedTangent;\n\n\t#endif\n\n#endif\n\n\n\t#endif\n\n\nvec3 transformed = vec3( position );\n\n\n#ifdef USE_MORPHTARGETS\n\n\t// morphTargetBaseInfluence is set based on BufferGeometry.morphTargetsRelative value:\n\t// When morphTargetsRelative is false, this is set to 1 - sum(influences); this results in position = sum((target - base) * influence)\n\t// When morphTargetsRelative is true, this is set to 1; as a result, all morph targets are simply added to the base after weighting\n\ttransformed *= morphTargetBaseInfluence;\n\n\t#ifdef MORPHTARGETS_TEXTURE\n\n\t\tfor ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {\n\n\t\t\tif ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];\n\n\t\t}\n\n\t#else\n\n\t\ttransformed += morphTarget0 * morphTargetInfluences[ 0 ];\n\t\ttransformed += morphTarget1 * morphTargetInfluences[ 1 ];\n\t\ttransformed += morphTarget2 * morphTargetInfluences[ 2 ];\n\t\ttransformed += morphTarget3 * morphTargetInfluences[ 3 ];\n\n\t\t#ifndef USE_MORPHNORMALS\n\n\t\t\ttransformed += morphTarget4 * morphTargetInfluences[ 4 ];\n\t\t\ttransformed += morphTarget5 * morphTargetInfluences[ 5 ];\n\t\t\ttransformed += morphTarget6 * morphTargetInfluences[ 6 ];\n\t\t\ttransformed += morphTarget7 * morphTargetInfluences[ 7 ];\n\n\t\t#endif\n\n\t#endif\n\n#endif\n\n\n#ifdef USE_SKINNING\n\n\tvec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );\n\n\tvec4 skinned = vec4( 0.0 );\n\tskinned += boneMatX * skinVertex * skinWeight.x;\n\tskinned += boneMatY * skinVertex * skinWeight.y;\n\tskinned += boneMatZ * skinVertex * skinWeight.z;\n\tskinned += boneMatW * skinVertex * skinWeight.w;\n\n\ttransformed = ( bindMatrixInverse * skinned ).xyz;\n\n#endif\n\n\nvec4 mvPosition = vec4( transformed, 1.0 );\n\n#ifdef USE_INSTANCING\n\n\tmvPosition = instanceMatrix * mvPosition;\n\n#endif\n\nmvPosition = modelViewMatrix * mvPosition;\n\ngl_Position = projectionMatrix * mvPosition;\n\n\n#ifdef USE_LOGDEPTHBUF\n\n\t#ifdef USE_LOGDEPTHBUF_EXT\n\n\t\tvFragDepth = 1.0 + gl_Position.w;\n\t\tvIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );\n\n\t#else\n\n\t\tif ( isPerspectiveMatrix( projectionMatrix ) ) {\n\n\t\t\tgl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;\n\n\t\t\tgl_Position.z *= gl_Position.w;\n\n\t\t}\n\n\t#endif\n\n#endif\n\n\n#if NUM_CLIPPING_PLANES > 0\n\n\tvClipPosition = - mvPosition.xyz;\n\n#endif\n\n\n\n#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0\n\n\tvec4 worldPosition = vec4( transformed, 1.0 );\n\n\t#ifdef USE_INSTANCING\n\n\t\tworldPosition = instanceMatrix * worldPosition;\n\n\t#endif\n\n\tworldPosition = modelMatrix * worldPosition;\n\n#endif\n\n\n#ifdef USE_ENVMAP\n\n\t#ifdef ENV_WORLDPOS\n\n\t\tvWorldPosition = worldPosition.xyz;\n\n\t#else\n\n\t\tvec3 cameraToVertex;\n\n\t\tif ( isOrthographic ) {\n\n\t\t\tcameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );\n\n\t\t} else {\n\n\t\t\tcameraToVertex = normalize( worldPosition.xyz - cameraPosition );\n\n\t\t}\n\n\t\tvec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );\n\n\t\t#ifdef ENVMAP_MODE_REFLECTION\n\n\t\t\tvReflect = reflect( cameraToVertex, worldNormal );\n\n\t\t#else\n\n\t\t\tvReflect = refract( cameraToVertex, worldNormal, refractionRatio );\n\n\t\t#endif\n\n\t#endif\n\n#endif\n\n\n#ifdef USE_FOG\n\n\tvFogDepth = - mvPosition.z;\n\n#endif\n\n\n}\n\n\n",
    "fragment": "// Created with NodeToy | Three.js r149\n\n// <node_builder>\n\n// uniforms\nuniform float ColorBottomIntensity; uniform vec4 ColorBottom; uniform float BottomCenterOP; uniform float BottomEdgeOP; uniform float BottomStepMin; uniform float BottomSmooth; uniform float EdgeWidth; uniform float DottedPosition; uniform float DottedSmooth; uniform vec4 ColorArrow; uniform float ColorArrowIntensity; uniform vec4 ColorEdge; uniform float ColorEdgeIntensity; uniform float Angle; uniform float Tilling; uniform float UnitLength; uniform float _time; uniform float Speed; uniform float ArrowThickness1; uniform float ArrowWidth; uniform float ArrowLength; uniform float ArrowThickness2; uniform float ArrowShapeChange; uniform vec4 ColorError; uniform float ColorErrorIntensity; uniform float ErrorPosition; uniform float ErrorSmooth; uniform float ErrorON; uniform float BottomOP; uniform float ShapeOP; uniform float EndLength; uniform float EndSmooth; \n// attributes\n\n// varys\nvarying vec2 nodeVary0; \n// vars\nfloat nodeVar0; float nodeVar1; vec2 nodeVar2; float nodeVar3; float nodeVar4; float nodeVar5; float nodeVar6; float nodeVar7; float nodeVar8; float nodeVar9; float nodeVar10; float nodeVar11; float nodeVar12; float nodeVar13; float nodeVar14; float nodeVar15; float nodeVar16; vec4 nodeVar17; vec4 nodeVar18; vec4 nodeVar19; vec4 nodeVar20; vec4 nodeVar21; float nodeVar22; float nodeVar23; vec2 nodeVar24; float nodeVar25; float nodeVar26; float nodeVar27; float nodeVar28; vec2 nodeVar29; vec2 nodeVar30; vec2 nodeVar31; float nodeVar32; float nodeVar33; float nodeVar34; float nodeVar35; float nodeVar36; float nodeVar37; float nodeVar38; float nodeVar39; float nodeVar40; float nodeVar41; vec2 nodeVar42; float nodeVar43; float nodeVar44; float nodeVar45; float nodeVar46; float nodeVar47; float nodeVar48; float nodeVar49; float nodeVar50; float nodeVar51; float nodeVar52; float nodeVar53; float nodeVar54; float nodeVar55; float nodeVar56; float nodeVar57; float nodeVar58; float nodeVar59; float nodeVar60; float nodeVar61; float nodeVar62; float nodeVar63; float nodeVar64; float nodeVar65; float nodeVar66; float nodeVar67; float nodeVar68; vec4 nodeVar69; vec3 nodeVar70; vec4 nodeVar71; vec4 nodeVar72; float nodeVar73; float nodeVar74; vec2 nodeVar75; float nodeVar76; vec4 nodeVar77; vec4 nodeVar78; vec3 nodeVar79; float nodeVar80; float nodeVar81; float nodeVar82; float nodeVar83; float nodeVar84; float nodeVar85; float nodeVar86; float nodeVar87; float nodeVar88; \n// codes\n\nvec2 func_1bb606c4_5ff0_41ae_ae2d_fc19f1d834fd( vec2 RotationCenter, float RotationAngle, vec2 UV){\n\tvec2 nodeVar_sWtDC20; vec2 nodeVar_sWtDC21; float nodeVar_sWtDC22; float nodeVar_sWtDC23; float nodeVar_sWtDC24; float nodeVar_sWtDC25; float nodeVar_sWtDC26; vec2 nodeVar_sWtDC27; float nodeVar_sWtDC28; vec2 nodeVar_sWtDC29; float nodeVar_sWtDC210; vec2 nodeVar_sWtDC211; vec2 nodeVar_sWtDC212; \n\tnodeVar_sWtDC20 = ( RotationCenter * vec2( -1.0 ) );\n\tnodeVar_sWtDC21 = ( nodeVar_sWtDC20 + UV );\n\tnodeVar_sWtDC22 = ( RotationAngle * 3.141592653589793 );\n\tnodeVar_sWtDC23 = ( nodeVar_sWtDC22 / 180.0 );\n\tnodeVar_sWtDC24 = cos( nodeVar_sWtDC23 );\n\tnodeVar_sWtDC25 = sin( nodeVar_sWtDC23 );\n\tnodeVar_sWtDC26 = ( nodeVar_sWtDC25 * -1.0 );\n\tnodeVar_sWtDC27 = vec2(nodeVar_sWtDC24,nodeVar_sWtDC26);\n\tnodeVar_sWtDC28 = (dot(nodeVar_sWtDC21,nodeVar_sWtDC27));\n\tnodeVar_sWtDC29 = vec2(nodeVar_sWtDC25,nodeVar_sWtDC24);\n\tnodeVar_sWtDC210 = (dot(nodeVar_sWtDC21,nodeVar_sWtDC29));\n\tnodeVar_sWtDC211 = vec2(nodeVar_sWtDC28,nodeVar_sWtDC210);\n\tnodeVar_sWtDC212 = ( RotationCenter + nodeVar_sWtDC211 );\n\t\n\treturn nodeVar_sWtDC212;\n}\n\n\n// variables\n// </node_builder>\n\n\n\n\n\n\n\n\n#ifndef FLAT_SHADED\n\n\tvarying vec3 vNormal;\n\n#endif\n\n\n#define PI 3.141592653589793\n#define PI2 6.283185307179586\n#define PI_HALF 1.5707963267948966\n#define RECIPROCAL_PI 0.3183098861837907\n#define RECIPROCAL_PI2 0.15915494309189535\n#define EPSILON 1e-6\n\n#ifndef saturate\n// <tonemapping_pars_fragment> may have defined saturate() already\n#define saturate( a ) clamp( a, 0.0, 1.0 )\n#endif\n#define whiteComplement( a ) ( 1.0 - saturate( a ) )\n\nfloat pow2( const in float x ) { return x*x; }\nvec3 pow2( const in vec3 x ) { return x*x; }\nfloat pow3( const in float x ) { return x*x*x; }\nfloat pow4( const in float x ) { float x2 = x*x; return x2*x2; }\nfloat max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }\nfloat average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }\n\n// expects values in the range of [0,1]x[0,1], returns values in the [0,1] range.\n// do not collapse into a single function per: http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/\nhighp float rand( const in vec2 uv ) {\n\n\tconst highp float a = 12.9898, b = 78.233, c = 43758.5453;\n\thighp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );\n\n\treturn fract( sin( sn ) * c );\n\n}\n\n#ifdef HIGH_PRECISION\n\tfloat precisionSafeLength( vec3 v ) { return length( v ); }\n#else\n\tfloat precisionSafeLength( vec3 v ) {\n\t\tfloat maxComponent = max3( abs( v ) );\n\t\treturn length( v / maxComponent ) * maxComponent;\n\t}\n#endif\n\nstruct IncidentLight {\n\tvec3 color;\n\tvec3 direction;\n\tbool visible;\n};\n\nstruct ReflectedLight {\n\tvec3 directDiffuse;\n\tvec3 directSpecular;\n\tvec3 indirectDiffuse;\n\tvec3 indirectSpecular;\n};\n\nstruct GeometricContext {\n\tvec3 position;\n\tvec3 normal;\n\tvec3 viewDir;\n#ifdef USE_CLEARCOAT\n\tvec3 clearcoatNormal;\n#endif\n};\n\nvec3 transformDirection( in vec3 dir, in mat4 matrix ) {\n\n\treturn normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );\n\n}\n\nvec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {\n\n\t// dir can be either a direction vector or a normal vector\n\t// upper-left 3x3 of matrix is assumed to be orthogonal\n\n\treturn normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );\n\n}\n\nmat3 transposeMat3( const in mat3 m ) {\n\n\tmat3 tmp;\n\n\ttmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );\n\ttmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );\n\ttmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );\n\n\treturn tmp;\n\n}\n\nbool isPerspectiveMatrix( mat4 m ) {\n\n\treturn m[ 2 ][ 3 ] == - 1.0;\n\n}\n\nvec2 equirectUv( in vec3 dir ) {\n\n\t// dir is assumed to be unit length\n\n\tfloat u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;\n\n\tfloat v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;\n\n\treturn vec2( u, v );\n\n}\n\n\n#ifdef DITHERING\n\n\t// based on https://www.shadertoy.com/view/MslGR8\n\tvec3 dithering( vec3 color ) {\n\t\t//Calculate grid position\n\t\tfloat grid_position = rand( gl_FragCoord.xy );\n\n\t\t//Shift the individual colors differently, thus making it even harder to see the dithering pattern\n\t\tvec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );\n\n\t\t//modify shift according to grid position.\n\t\tdither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );\n\n\t\t//shift the color by dither_shift\n\t\treturn color + dither_shift_RGB;\n\t}\n\n#endif\n\n\n#if defined( USE_COLOR_ALPHA )\n\n\tvarying vec4 vColor;\n\n#elif defined( USE_COLOR )\n\n\tvarying vec3 vColor;\n\n#endif\n\n\n#if ( defined( USE_UV ) && ! defined( UVS_VERTEX_ONLY ) )\n\n\tvarying vec2 vUv;\n\n#endif\n\n\n#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )\n\n\tvarying vec2 vUv2;\n\n#endif\n\n\n#ifdef USE_MAP\n\n\tuniform sampler2D map;\n\n#endif\n\n\n#ifdef USE_ALPHAMAP\n\n\tuniform sampler2D alphaMap;\n\n#endif\n\n\n#ifdef USE_ALPHATEST\n\tuniform float alphaTest;\n#endif\n\n\n#ifdef USE_AOMAP\n\n\tuniform sampler2D aoMap;\n\tuniform float aoMapIntensity;\n\n#endif\n\n\n#ifdef USE_LIGHTMAP\n\n\tuniform sampler2D lightMap;\n\tuniform float lightMapIntensity;\n\n#endif\n\n\n#ifdef USE_ENVMAP\n\n\tuniform float envMapIntensity;\n\tuniform float flipEnvMap;\n\n\t#ifdef ENVMAP_TYPE_CUBE\n\t\tuniform samplerCube envMap;\n\t#else\n\t\tuniform sampler2D envMap;\n\t#endif\n\t\n#endif\n\n\n#ifdef USE_ENVMAP\n\n\tuniform float reflectivity;\n\n\t#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )\n\n\t\t#define ENV_WORLDPOS\n\n\t#endif\n\n\t#ifdef ENV_WORLDPOS\n\n\t\tvarying vec3 vWorldPosition;\n\t\tuniform float refractionRatio;\n\t#else\n\t\tvarying vec3 vReflect;\n\t#endif\n\n#endif\n\n\n#ifdef USE_FOG\n\n\tuniform vec3 fogColor;\n\tvarying float vFogDepth;\n\n\t#ifdef FOG_EXP2\n\n\t\tuniform float fogDensity;\n\n\t#else\n\n\t\tuniform float fogNear;\n\t\tuniform float fogFar;\n\n\t#endif\n\n#endif\n\n\n#ifdef USE_SPECULARMAP\n\n\tuniform sampler2D specularMap;\n\n#endif\n\n\n#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )\n\n\tuniform float logDepthBufFC;\n\tvarying float vFragDepth;\n\tvarying float vIsPerspective;\n\n#endif\n\n\n#if NUM_CLIPPING_PLANES > 0\n\n\tvarying vec3 vClipPosition;\n\n\tuniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];\n\n#endif\n\n\nvoid main() {\n\n\n\n\n#if NUM_CLIPPING_PLANES > 0\n\n\tvec4 plane;\n\n\t#pragma unroll_loop_start\n\tfor ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {\n\n\t\tplane = clippingPlanes[ i ];\n\t\tif ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;\n\n\t}\n\t#pragma unroll_loop_end\n\n\t#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES\n\n\t\tbool clipped = true;\n\n\t\t#pragma unroll_loop_start\n\t\tfor ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {\n\n\t\t\tplane = clippingPlanes[ i ];\n\t\t\tclipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;\n\n\t\t}\n\t\t#pragma unroll_loop_end\n\n\t\tif ( clipped ) discard;\n\n\t#endif\n\n#endif\n\n\n\tvec4 diffuseColor = vec4( 0.0 );\n\n\n#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )\n\n\t// Doing a strict comparison with == 1.0 can cause noise artifacts\n\t// on some platforms. See issue #17623.\n\tgl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;\n\n#endif\n\n\n#ifdef USE_MAP\n\n\tvec4 sampledDiffuseColor = texture2D( map, vUv );\n\n\t#ifdef DECODE_VIDEO_TEXTURE\n\n\t\t// inline sRGB decode (TODO: Remove this code when https://crbug.com/1256340 is solved)\n\n\t\tsampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );\n\n\t#endif\n\n\tdiffuseColor *= sampledDiffuseColor;\n\n#endif\n\n\n#if defined( USE_COLOR_ALPHA )\n\n\tdiffuseColor *= vColor;\n\n#elif defined( USE_COLOR )\n\n\tdiffuseColor.rgb *= vColor;\n\n#endif\n\nnodeVar0 = ( BottomStepMin + BottomSmooth );\n\tnodeVar1 = clamp( nodeVar0, 0.0, 1.0 );\n\tnodeVar2 = (nodeVary0 * vec2( 1, 1 ) + vec2( 0, 0 ));\n\tnodeVar3 = vec4( nodeVar2.xy, 0.0, 1.0 ).y;\n\tnodeVar4 = ( nodeVar3 - 0.5 );\n\tnodeVar5 = abs( nodeVar4 );\n\tnodeVar6 = ( nodeVar5 * 2.0 );\n\tnodeVar7 = smoothstep( BottomStepMin, nodeVar1, nodeVar6 );\n\tnodeVar8 = (mix(BottomCenterOP, BottomEdgeOP, nodeVar7));\n\t\t\n\tnodeVar9 = ( 1.0 - nodeVar6 );\n\tnodeVar10 = step( nodeVar9, EdgeWidth );\n\tnodeVar11 = ( DottedPosition + DottedSmooth );\n\tnodeVar12 = clamp( nodeVar11, 0.0, 1.0 );\n\tnodeVar13 = vec4( nodeVar2.xy, 0.0, 1.0 ).x;\n\tnodeVar14 = smoothstep( DottedPosition, nodeVar12, nodeVar13 );\n\tnodeVar15 = (mix(nodeVar10, 0.0, nodeVar14));\n\t\t\n\tnodeVar16 = (mix(nodeVar8, 1.0, nodeVar15));\n\t\t\n\tnodeVar17 = ( ColorBottom * vec4( vec3( nodeVar16 ), 1.0 ) );\n\tnodeVar18 = ( vec4( vec3( ColorBottomIntensity ), 1.0 ) * nodeVar17 );\n\tnodeVar19 = ( ColorArrow * vec4( vec3( ColorArrowIntensity ), 1.0 ) );\n\tnodeVar20 = ( ColorEdge * vec4( vec3( ColorEdgeIntensity ), 1.0 ) );\n\tnodeVar21 = (mix(nodeVar19, nodeVar20, vec4( vec3( nodeVar15 ), 1.0 )));\n\t\t\n\tnodeVar22 = ( Tilling * nodeVar2.x );\n\tnodeVar23 = ( nodeVar22 * UnitLength );\n\tnodeVar24 = vec2(nodeVar23,nodeVar2.y);\n\tnodeVar25 = ( _time * 1.0 );\n\tnodeVar26 = nodeVar25;\n\tnodeVar27 = ( nodeVar26 * Speed );\n\tnodeVar28 = ( nodeVar27 * -1.0 );\n\tnodeVar29 = vec2(nodeVar28,0.0);\n\tnodeVar30 = ( nodeVar24 + nodeVar29 );\n\tnodeVar31 = func_1bb606c4_5ff0_41ae_ae2d_fc19f1d834fd(vec2( 0.5, 0.5 ),Angle,nodeVar30);\n\tnodeVar32 = vec4( nodeVar31.xy, 0.0, 1.0 ).x;\n\tnodeVar33 = fract( nodeVar32 );\n\tnodeVar34 = ( nodeVar33 - 0.5 );\n\tnodeVar35 = abs( nodeVar34 );\n\tnodeVar36 = ( nodeVar35 * 2.0 );\n\tnodeVar37 = ( ArrowThickness1 + ArrowWidth );\n\tnodeVar38 = step( nodeVar36, nodeVar37 );\n\tnodeVar39 = step( nodeVar36, ArrowWidth );\n\tnodeVar40 = ( nodeVar38 - nodeVar39 );\n\tnodeVar41 = ( Angle * -1.0 );\n\tnodeVar42 = func_1bb606c4_5ff0_41ae_ae2d_fc19f1d834fd(vec2( 0.5, 0.5 ),nodeVar41,nodeVar30);\n\tnodeVar43 = vec4( nodeVar42.xy, 0.0, 1.0 ).x;\n\tnodeVar44 = fract( nodeVar43 );\n\tnodeVar45 = ( nodeVar44 - 0.5 );\n\tnodeVar46 = abs( nodeVar45 );\n\tnodeVar47 = ( nodeVar46 * 2.0 );\n\tnodeVar48 = step( nodeVar47, nodeVar37 );\n\tnodeVar49 = step( nodeVar47, ArrowWidth );\n\tnodeVar50 = ( nodeVar48 - nodeVar49 );\n\tnodeVar51 = step( 0.5, nodeVar3 );\n\tnodeVar52 = (mix(nodeVar40, nodeVar50, nodeVar51));\n\t\t\n\tnodeVar53 = ( ArrowLength + ArrowThickness2 );\n\tnodeVar54 = step( nodeVar6, nodeVar53 );\n\tnodeVar55 = ( nodeVar52 * nodeVar54 );\n\tnodeVar56 = (mix(nodeVar38, nodeVar48, nodeVar51));\n\t\t\n\tnodeVar57 = step( nodeVar6, ArrowLength );\n\tnodeVar58 = ( nodeVar54 - nodeVar57 );\n\tnodeVar59 = ( nodeVar56 * nodeVar58 );\n\tnodeVar60 = ( nodeVar55 + nodeVar59 );\n\tnodeVar61 = clamp( nodeVar60, 0.0, 1.0 );\n\tnodeVar62 = (mix(nodeVar61, 1.0, nodeVar15));\n\t\t\n\tnodeVar63 = step( nodeVar33, ArrowWidth );\n\tnodeVar64 = step( nodeVar44, ArrowWidth );\n\tnodeVar65 = (mix(nodeVar63, nodeVar64, nodeVar51));\n\t\t\n\tnodeVar66 = (mix(0.0, nodeVar65, nodeVar57));\n\t\t\n\tnodeVar67 = (mix(nodeVar66, 1.0, nodeVar15));\n\t\t\n\tnodeVar68 = (mix(nodeVar62, nodeVar67, ArrowShapeChange));\n\t\t\n\tnodeVar69 = (mix(nodeVar18, nodeVar21, vec4( vec3( nodeVar68 ), 1.0 )));\n\t\t\n\tnodeVar70 = (mix( nodeVar69.xyz, vec3(dot( nodeVar69.xyz, vec3( 0.299, 0.587, 0.114 ))), 1.0 ));\n\tnodeVar71 = ( ColorError * vec4( vec3( ColorErrorIntensity ), 1.0 ) );\n\tnodeVar72 = ( vec4( nodeVar70, 1.0 ) * nodeVar71 );\n\tnodeVar73 = ( ErrorPosition + ErrorSmooth );\n\tnodeVar74 = clamp( nodeVar73, 0.0, 1.0 );\n\tnodeVar75 = (nodeVary0 * vec2( 1, 1 ) + vec2( 0, 0 ));\n\tnodeVar76 = smoothstep( ErrorPosition, nodeVar74, nodeVar75.x );\n\tnodeVar77 = (mix(nodeVar69, nodeVar72, vec4( vec3( nodeVar76 ), 1.0 )));\n\t\t\n\tnodeVar78 = (mix(nodeVar69, nodeVar77, vec4( vec3( ErrorON ), 1.0 )));\n\t\t\n\tnodeVar79 = ( nodeVar78.xyz * vec3( 1, 1, 1 ) );\n\t\n\tdiffuseColor = vec4( nodeVar79, 1.0 );\n\n\n#ifdef USE_ALPHAMAP\n\n\tdiffuseColor.a *= texture2D( alphaMap, vUv ).g;\n\n#endif\n\nnodeVar80 = (mix(nodeVar16, 0.0, nodeVar14));\n\t\t\n\tnodeVar81 = ( nodeVar80 * BottomOP );\n\tnodeVar82 = (mix(nodeVar81, ShapeOP, nodeVar62));\n\t\t\n\tnodeVar83 = (mix(nodeVar81, ShapeOP, nodeVar67));\n\t\t\n\tnodeVar84 = (mix(nodeVar82, nodeVar83, ArrowShapeChange));\n\t\t\n\tnodeVar85 = ( EndLength + EndSmooth );\n\tnodeVar86 = clamp( nodeVar85, 0.0, 1.0 );\n\tnodeVar87 = smoothstep( EndLength, nodeVar86, nodeVar75.x );\n\tnodeVar88 = (mix(nodeVar84, 0.0, nodeVar87));\n\t\t\n\t\n\tdiffuseColor.a = nodeVar88;\n\n\n#ifdef USE_ALPHATEST\n\n\tif ( diffuseColor.a < alphaTest ) discard;\n\n#endif\n\n\nfloat specularStrength;\n\n#ifdef USE_SPECULARMAP\n\n\tvec4 texelSpecular = texture2D( specularMap, vUv );\n\tspecularStrength = texelSpecular.r;\n\n#else\n\n\tspecularStrength = 1.0;\n\n#endif\n\n\n\tReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n\n\t// accumulation (baked indirect lighting only)\n\t#ifdef USE_LIGHTMAP\n\n\t\tvec4 lightMapTexel = texture2D( lightMap, vUv2 );\n\t\treflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;\n\n\t#else\n\n\t\treflectedLight.indirectDiffuse += vec3( 1.0 );\n\n\t#endif\n\n\t// modulation\n\t\n\n\treflectedLight.indirectDiffuse *= diffuseColor.rgb;\n\n\tvec3 outgoingLight = reflectedLight.indirectDiffuse;\n\n\n#ifdef USE_ENVMAP\n\n\t#ifdef ENV_WORLDPOS\n\n\t\tvec3 cameraToFrag;\n\n\t\tif ( isOrthographic ) {\n\n\t\t\tcameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );\n\n\t\t} else {\n\n\t\t\tcameraToFrag = normalize( vWorldPosition - cameraPosition );\n\n\t\t}\n\n\t\t// Transforming Normal Vectors with the Inverse Transformation\n\t\tvec3 worldNormal = inverseTransformDirection( normal, viewMatrix );\n\n\t\t#ifdef ENVMAP_MODE_REFLECTION\n\n\t\t\tvec3 reflectVec = reflect( cameraToFrag, worldNormal );\n\n\t\t#else\n\n\t\t\tvec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );\n\n\t\t#endif\n\n\t#else\n\n\t\tvec3 reflectVec = vReflect;\n\n\t#endif\n\n\t#ifdef ENVMAP_TYPE_CUBE\n\n\t\tvec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );\n\n\t#else\n\n\t\tvec4 envColor = vec4( 0.0 );\n\n\t#endif\n\n\t#ifdef ENVMAP_BLENDING_MULTIPLY\n\n\t\toutgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );\n\n\t#elif defined( ENVMAP_BLENDING_MIX )\n\n\t\toutgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );\n\n\t#elif defined( ENVMAP_BLENDING_ADD )\n\n\t\toutgoingLight += envColor.xyz * specularStrength * reflectivity;\n\n\t#endif\n\n#endif\n\n\n\n#ifdef OPAQUE\ndiffuseColor.a = 1.0;\n#endif\n\n// https://github.com/mrdoob/three.js/pull/22425\n#ifdef USE_TRANSMISSION\ndiffuseColor.a *= material.transmissionAlpha + 0.1;\n#endif\n\ngl_FragColor = vec4( outgoingLight, diffuseColor.a );\n\n\n#if defined( TONE_MAPPING )\n\n\tgl_FragColor.rgb = toneMapping( gl_FragColor.rgb );\n\n#endif\n\n\ngl_FragColor = linearToOutputTexel( gl_FragColor );\n\n\n#ifdef USE_FOG\n\n\t#ifdef FOG_EXP2\n\n\t\tfloat fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );\n\n\t#else\n\n\t\tfloat fogFactor = smoothstep( fogNear, fogFar, vFogDepth );\n\n\t#endif\n\n\tgl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );\n\n#endif\n\n\n#ifdef PREMULTIPLIED_ALPHA\n\n\t// Get get normal blending with premultipled, use with CustomBlending, OneFactor, OneMinusSrcAlphaFactor, AddEquation.\n\tgl_FragColor.rgb *= gl_FragColor.a;\n\n#endif\n\n\n#ifdef DITHERING\n\n\tgl_FragColor.rgb = dithering( gl_FragColor.rgb );\n\n#endif\n\n\n}\n\n\n",
    "cullMode": "off",
    "lightModel": "unlit",
    "renderType": "transparent"
  };